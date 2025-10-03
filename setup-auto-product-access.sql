-- Create function to automatically create product_access record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_product_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.product_access (user_id, has_access)
  VALUES (NEW.id, false)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created_product_access ON auth.users;
CREATE TRIGGER on_auth_user_created_product_access
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_product_access();

SELECT 'Auto product access trigger created successfully! New users will have has_access=false by default.' as message;
