# Authentication Setup Guide

This guide walks you through setting up Google OAuth authentication and user history storage for TestSpec Studio.

## Prerequisites

- Supabase account (free tier)
- Google Cloud Console access

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `testspec-studio`
   - Database Password: (generate a strong password)
   - Region: (choose closest to you)
4. Wait for project creation (~2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon/public key** → This is your `VITE_SUPABASE_ANON_KEY`

## Step 3: Set Up Database Schema

Run this SQL in the Supabase SQL Editor:

```sql
-- Create test_history table
CREATE TABLE test_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story TEXT NOT NULL,
  framework TEXT NOT NULL,
  manual_tests JSONB NOT NULL,
  automation_skeletons TEXT NOT NULL,
  exports JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX test_history_user_id_created_at_idx
ON test_history(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE test_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own history
CREATE POLICY "Users can view own history"
ON test_history FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own history
CREATE POLICY "Users can insert own history"
ON test_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own history
CREATE POLICY "Users can delete own history"
ON test_history FOR DELETE
USING (auth.uid() = user_id);

-- Function to auto-delete old history (3 days)
CREATE OR REPLACE FUNCTION delete_old_test_history()
RETURNS void AS $$
BEGIN
  DELETE FROM test_history
  WHERE created_at < NOW() - INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule the cleanup (run daily)
SELECT cron.schedule(
  'delete-old-test-history',
  '0 0 * * *', -- Daily at midnight
  $$SELECT delete_old_test_history()$$
);
```

## Step 4: Configure Google OAuth in Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. Enable Google provider
4. You'll need Google OAuth credentials (next step)

## Step 5: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Name: `TestSpec Studio`
   - Authorized JavaScript origins:
     - `http://localhost:8888` (for local dev)
     - Your Netlify domain (e.g., `https://testspec-studio.netlify.app`)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
6. Copy **Client ID** and **Client Secret**

## Step 6: Add Google Credentials to Supabase

1. Back in Supabase **Authentication** → **Providers** → **Google**
2. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
3. Click **Save**

## Step 7: Update Environment Variables

### Local Development (.env)

```bash
GEMINI_API_KEY=your_gemini_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Netlify Deployment

1. Go to your Netlify site settings
2. **Site settings** → **Environment variables**
3. Add:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Step 8: Test Authentication

1. Restart your dev server: `netlify dev`
2. Visit `http://localhost:8888`
3. Click "Sign in with Google"
4. Complete OAuth flow
5. You should be redirected to the workspace

## Features Enabled

✅ Google OAuth authentication
✅ User history storage (3 days retention)
✅ Max 10 historical records per user
✅ Automatic cleanup of old data
✅ GDPR-compliant data handling
✅ Legal pages (Privacy Policy, Terms of Service)

## Troubleshooting

### "Invalid redirect URI"
- Make sure your redirect URI in Google Console matches your Supabase callback URL exactly

### "Failed to sign in"
- Check that Google OAuth is enabled in Supabase
- Verify Client ID and Secret are correct
- Check browser console for specific errors

### History not saving
- Verify database schema is created
- Check RLS policies are enabled
- Confirm user is authenticated

## Data Retention Policy

- **Retention**: 3 days from creation
- **Max Records**: 10 per user
- **Auto-cleanup**: Daily at midnight UTC
- **User Control**: Users can delete their history anytime

## GDPR Compliance

- Users can request data deletion
- Data is automatically purged after 3 days
- Privacy Policy explains data usage
- Terms of Service outline user rights
