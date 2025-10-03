-- Create product access control table
CREATE TABLE IF NOT EXISTS public.product_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  has_access BOOLEAN DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  granted_by UUID REFERENCES auth.users(id),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for admin access
ALTER TABLE public.product_access DISABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_access_user_id ON public.product_access(user_id);
CREATE INDEX IF NOT EXISTS idx_product_access_has_access ON public.product_access(has_access);

-- Grant all existing users access by default (you can change this)
INSERT INTO public.product_access (user_id, has_access, granted_at)
SELECT
  id,
  true,
  NOW()
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

SELECT 'Product access table created successfully!' as message;
