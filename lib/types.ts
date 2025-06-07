export interface User {
  id: string
  firebase_uid: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface Card {
  id: string
  name: string
  slug: string
  bank: string
  category: string
  eligibility: string
  benefits: string
  referral_url?: string
  image_url?: string
  joining_fee: number
  annual_fee: number
  created_at: string
  status: string
  submitted_by?: string
  description?: string
  user?: {
    name: string
    email?: string
  }
}

export interface Referral {
  id: string
  user_id: string
  card_id: string
  referral_url: string
  description?: string
  created_at: string
  card?: Card
  user?: User
}

export interface Click {
  id: string
  referral_id: string
  user_agent?: string
  ip_address?: string
  created_at: string
}

export interface ReferralWithStats extends Referral {
  click_count: number
}
