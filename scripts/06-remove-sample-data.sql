-- Remove all sample cards
DELETE FROM cards WHERE status = 'approved' AND submitted_by IS NULL;

-- Alternative approach if you want to keep some structure:
-- UPDATE cards SET status = 'archived' WHERE status = 'approved' AND submitted_by IS NULL;
