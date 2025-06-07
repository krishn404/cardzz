-- Add a status column to cards table to track approval
ALTER TABLE cards ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE cards ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES users(id);

-- Update the existing cards to be approved
UPDATE cards SET status = 'approved' WHERE status IS NULL OR status = 'pending';

-- Update RLS policies for user submissions
DROP POLICY IF EXISTS "Anyone can view cards" ON cards;
CREATE POLICY "Anyone can view approved cards" ON cards FOR SELECT USING (status = 'approved');

-- Allow users to view their own submitted cards
CREATE POLICY "Users can view their own submitted cards" ON cards FOR SELECT USING (
  submitted_by IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
);

-- Allow users to submit cards for approval
CREATE POLICY "Users can submit cards" ON cards FOR INSERT WITH CHECK (
  submitted_by IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
  AND status = 'pending'
);

-- Allow users to update their own pending cards
CREATE POLICY "Users can update their own pending cards" ON cards FOR UPDATE USING (
  submitted_by IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
  AND status = 'pending'
);
