"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Referral } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReferralForm } from "./referral-form"
import { ReferralList } from "./referral-list"

interface ReferralSectionProps {
  cardId: string
}

export function ReferralSection({ cardId }: ReferralSectionProps) {
  const { user, dbUser } = useAuth()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReferrals()
  }, [cardId])

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          user:users(name, email)
        `)
        .eq("card_id", cardId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setReferrals(data || [])
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReferralAdded = () => {
    setShowForm(false)
    fetchReferrals()
  }

  if (loading) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Community Referrals</CardTitle>
        <p className="text-gray-600">Get this card through community referral links and help others earn rewards.</p>
      </CardHeader>
      <CardContent>
        {user && dbUser && (
          <div className="mb-6">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)}>Share Your Referral Link</Button>
            ) : (
              <ReferralForm
                cardId={cardId}
                userId={dbUser.id}
                onSuccess={handleReferralAdded}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        )}

        <ReferralList referrals={referrals} currentUserId={dbUser?.id} />
      </CardContent>
    </Card>
  )
}
