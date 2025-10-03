-- Fix the user profile sync trigger to handle errors gracefully

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS sync_user_profile();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user profile
  INSERT INTO public.user_profiles (user_id, email, created_at, last_sign_in, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.created_at, NOW()),
    NEW.last_sign_in_at,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    last_sign_in = NEW.last_sign_in_at,
    email = NEW.email,
    provider = COALESCE(NEW.raw_app_meta_data->>'provider', EXCLUDED.provider);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth operation
    RAISE WARNING 'Failed to sync user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_profile();

-- Make sure the user_profiles table exists and RLS is disabled
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  provider TEXT
);

-- Disable RLS to ensure admins can access
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Sync existing users (update existing profiles or insert new ones)
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
