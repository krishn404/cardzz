-- Insert sample cards
INSERT INTO cards (name, slug, bank, category, eligibility, benefits, joining_fee, annual_fee, image_url) VALUES
('Chase Sapphire Preferred', 'chase-sapphire-preferred', 'Chase', 'Travel', 'Good Credit', '2x points on travel and dining, 60,000 bonus points', 0, 95, '/placeholder.svg?height=200&width=300'),
('Capital One Venture X', 'capital-one-venture-x', 'Capital One', 'Travel', 'Excellent Credit', '2x miles on everything, $300 annual travel credit', 0, 395, '/placeholder.svg?height=200&width=300'),
('Citi Double Cash', 'citi-double-cash', 'Citi', 'Cashback', 'Good Credit', '2% cash back on all purchases (1% when you buy, 1% when you pay)', 0, 0, '/placeholder.svg?height=200&width=300'),
('Discover it Student', 'discover-it-student', 'Discover', 'Student', 'Student', '5% cash back on rotating categories, no annual fee', 0, 0, '/placeholder.svg?height=200&width=300'),
('American Express Gold', 'amex-gold', 'American Express', 'Dining', 'Good Credit', '4x points on dining and groceries, $120 dining credit', 0, 250, '/placeholder.svg?height=200&width=300'),
('Chase Freedom Unlimited', 'chase-freedom-unlimited', 'Chase', 'Cashback', 'Fair Credit', '1.5% cash back on all purchases, $200 bonus', 0, 0, '/placeholder.svg?height=200&width=300');

-- Insert admin user (replace with your Firebase UID)
INSERT INTO users (firebase_uid, name, email, is_admin) VALUES
('admin-firebase-uid-here', 'Admin User', 'admin@cardly.com', true);
