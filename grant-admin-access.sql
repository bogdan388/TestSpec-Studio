-- Grant product access to admin@admin.com
UPDATE public.product_access
SET
  has_access = true,
  granted_at = NOW(),
  revoked_at = NULL,
  revoked_by = NULL,
  notes = 'Admin user - default access'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@admin.com'
);

-- If no record exists, create one
INSERT INTO public.product_access (user_id, has_access, granted_at, notes)
SELECT
  id,
  true,
  NOW(),
  'Admin user - default access'
FROM auth.users
WHERE email = 'admin@admin.com'
ON CONFLICT (user_id)
DO UPDATE SET
  has_access = true,
  granted_at = NOW(),
  revoked_at = NULL,
  revoked_by = NULL,
  notes = 'Admin user - default access';

SELECT 'Admin access granted!' as message;
