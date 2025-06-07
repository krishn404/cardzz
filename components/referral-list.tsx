"use client"

import { useState } from "react"
import type { Referral } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ReferralListProps {
  referrals: Referral[]
  currentUserId?: string
}

export function ReferralList({ referrals, currentUserId }: ReferralListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleClick = async (referralId: string, url: string) => {
    // Track click
    try {
      await supabase.from("clicks").insert({
        referral_id: referralId,
        user_agent: navigator.userAgent,
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }

    // Open URL
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleDelete = async (referralId: string) => {
    if (!confirm("Are you sure you want to delete this referral?")) return

    setDeletingId(referralId)
    try {
      const { error } = await supabase.from("referrals").delete().eq("id", referralId)

      if (error) throw error
      window.location.reload()
    } catch (error) {
      console.error("Error deleting referral:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (referrals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No referral links available yet. Be the first to share yours!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {referrals.map((referral) => (
        <div key={referral.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">{referral.user?.name}</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(referral.created_at).toLocaleDateString()}
                </Badge>
              </div>

              {referral.description && <p className="text-gray-700 mb-3">{referral.description}</p>}

              <Button onClick={() => handleClick(referral.id, referral.referral_url)} className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Use This Referral
              </Button>
            </div>

            {currentUserId === referral.user_id && (
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(referral.id)}
                  disabled={deletingId === referral.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
