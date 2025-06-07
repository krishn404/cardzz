-- Comprehensive test to verify card submission flow

-- 1. Check if all required tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('users', 'cards', 'referrals', 'clicks') THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'cards', 'referrals', 'clicks');

-- 2. Check if required columns exist in cards table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'cards';

-- 4. Test data integrity
SELECT 
  status,
  COUNT(*) as count,
  MIN(created_at) as oldest,
  MAX(created_at) as newest
FROM cards 
GROUP BY status;

-- 5. Check for any orphaned records
SELECT 
  'Cards without users' as check_type,
  COUNT(*) as count
FROM cards c
LEFT JOIN users u ON c.submitted_by = u.id
WHERE c.submitted_by IS NOT NULL AND u.id IS NULL

UNION ALL

SELECT 
  'Referrals without cards' as check_type,
  COUNT(*) as count
FROM referrals r
LEFT JOIN cards c ON r.card_id = c.id
WHERE c.id IS NULL

UNION ALL

SELECT 
  'Referrals without users' as check_type,
  COUNT(*) as count
FROM referrals r
LEFT JOIN users u ON r.user_id = u.id
WHERE u.id IS NULL;
