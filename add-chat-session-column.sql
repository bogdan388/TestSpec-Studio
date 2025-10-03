-- Add is_chat_session column to test_history table
ALTER TABLE public.test_history
ADD COLUMN IF NOT EXISTS is_chat_session BOOLEAN DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_test_history_is_chat_session
  ON public.test_history(user_id, is_chat_session, created_at DESC);

SELECT 'Chat session column added successfully!' as message;
