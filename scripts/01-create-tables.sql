-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bank TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  benefits TEXT NOT NULL,
  referral_url TEXT,
  image_url TEXT,
  joining_fee INTEGER DEFAULT 0,
  annual_fee INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  referral_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clicks table
CREATE TABLE IF NOT EXISTS clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
