-- Temporarily disable the problematic trigger to fix authentication
-- We'll sync user profiles manually via the application instead

-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS sync_user_profile() CASCADE;

-- Make sure user_profiles table exists
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  provider TEXT
);

-- Disable RLS
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Sync existing users manually
INSERT INTO public.user_profiles (user_id, email, created_at, last_sign_in, provider)
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  COALESCE(raw_app_meta_data->>'provider', 'email')
FROM auth.users
ON CONFLICT (user_id)
DO UPDATE SET
  last_sign_in = EXCLUDED.last_sign_in,
  email = EXCLUDED.email;

-- Success message
SELECT 'Trigger disabled. Authentication should work now.' as message;
