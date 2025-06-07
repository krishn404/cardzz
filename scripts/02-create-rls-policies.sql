-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (firebase_uid = auth.jwt() ->> 'sub');
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (firebase_uid = auth.jwt() ->> 'sub');

-- Cards policies (public read, admin write)
CREATE POLICY "Anyone can view cards" ON cards FOR SELECT USING (true);
CREATE POLICY "Only admins can insert cards" ON cards FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE firebase_uid = auth.jwt() ->> 'sub' AND is_admin = true)
);
CREATE POLICY "Only admins can update cards" ON cards FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE firebase_uid = auth.jwt() ->> 'sub' AND is_admin = true)
);
CREATE POLICY "Only admins can delete cards" ON cards FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE firebase_uid = auth.jwt() ->> 'sub' AND is_admin = true)
);

-- Referrals policies
CREATE POLICY "Anyone can view referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Users can insert their own referrals" ON referrals FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
);
CREATE POLICY "Users can update their own referrals" ON referrals FOR UPDATE USING (
  user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
);
CREATE POLICY "Users can delete their own referrals or admins can delete any" ON referrals FOR DELETE USING (
  user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub')
  OR EXISTS (SELECT 1 FROM users WHERE firebase_uid = auth.jwt() ->> 'sub' AND is_admin = true)
);

-- Clicks policies
CREATE POLICY "Anyone can insert clicks" ON clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view clicks" ON clicks FOR SELECT USING (true);
