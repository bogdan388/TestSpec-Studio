-- Add missing columns to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Now run the safe sync trigger setup
-- Create safe sync function that handles errors gracefully
CREATE OR REPLACE FUNCTION public.safe_sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Use INSERT with ON CONFLICT to safely handle duplicates
  INSERT INTO public.user_profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block auth
    RAISE WARNING 'Failed to sync user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created_sync ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated_sync ON auth.users;

-- Create triggers for new users and updates
CREATE TRIGGER on_auth_user_created_sync
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.safe_sync_user_profile();

CREATE TRIGGER on_auth_user_updated_sync
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email OR
        OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.safe_sync_user_profile();

-- Sync existing users that might be missing
INSERT INTO public.user_profiles (user_id, email, full_name, avatar_url)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', NULL),
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (user_id)
DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

SELECT 'User profiles updated and synced successfully!' as message;
