-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Anyone can view approved cards" ON cards;
DROP POLICY IF EXISTS "Users can view their own submitted cards" ON cards;
DROP POLICY IF EXISTS "Users can submit cards" ON cards;
DROP POLICY IF EXISTS "Users can update their own pending cards" ON cards;

-- Create new, more permissive policies for immediate card display
CREATE POLICY "Anyone can view all cards" ON cards FOR SELECT USING (true);

-- Allow authenticated users to insert cards
CREATE POLICY "Authenticated users can insert cards" ON cards FOR INSERT WITH CHECK (
  auth.jwt() ->> 'sub' IS NOT NULL
);

-- Allow users to update their own cards
CREATE POLICY "Users can update their own cards" ON cards FOR UPDATE USING (
  submitted_by IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
);

-- Allow users to delete their own cards
CREATE POLICY "Users can delete their own cards" ON cards FOR DELETE USING (
  submitted_by IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
);

-- Ensure users table policies are correct
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Anyone can insert user profiles" ON users FOR INSERT WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_cards_status_created ON cards(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_submitted_by ON cards(submitted_by);
