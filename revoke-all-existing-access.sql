-- Optional: Revoke access from all existing users (run this if you want to reset everyone to no access)
UPDATE public.product_access
SET
  has_access = false,
  revoked_at = NOW(),
  revoked_by = NULL,
  notes = 'Mass revocation - new default policy'
WHERE has_access = true;

SELECT 'All existing users access revoked!' as message;
