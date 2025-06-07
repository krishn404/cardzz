"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { ReferralWithStats } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function MyReferralsPage() {
  const { user, dbUser } = useAuth()
  const [referrals, setReferrals] = useState<ReferralWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dbUser) {
      fetchMyReferrals()
    }
  }, [dbUser])

  const fetchMyReferrals = async () => {
    if (!dbUser) return

    try {
      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          card:cards(name, slug, bank),
          clicks(id)
        `)
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const referralsWithStats = (data || []).map((referral) => ({
        ...referral,
        click_count: referral.clicks?.length || 0,
      }))

      setReferrals(referralsWithStats)
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (referralId: string) => {
    if (!confirm("Are you sure you want to delete this referral?")) return

    try {
      const { error } = await supabase.from("referrals").delete().eq("id", referralId)

      if (error) throw error
      fetchMyReferrals()
    } catch (error) {
      console.error("Error deleting referral:", error)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600">Please sign in to view your referrals.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Referrals</h1>
        <p className="text-gray-600">Manage your referral links and track their performance.</p>
      </div>

      {referrals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't submitted any referrals yet.</p>
            <Button asChild>
              <Link href="/">Browse Cards to Share</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {referrals.map((referral) => (
            <Card key={referral.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/cards/${referral.card?.slug}`} className="hover:text-blue-600">
                        {referral.card?.name}
                      </Link>
                    </CardTitle>
                    <p className="text-gray-600">{referral.card?.bank}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <BarChart3 className="h-3 w-3" />
                      <span>{referral.click_count} clicks</span>
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(referral.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {referral.description && <p className="text-gray-700 mb-4">{referral.description}</p>}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Submitted on {new Date(referral.created_at).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={referral.referral_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Link
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
