"use client"

import { useState } from "react"
import type { ReferralWithStats } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, BarChart3 } from "lucide-react"

interface AdminReferralListProps {
  referrals: ReferralWithStats[]
  onRefresh: () => void
}

export function AdminReferralList({ referrals, onRefresh }: AdminReferralListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (referralId: string) => {
    if (!confirm("Are you sure you want to delete this referral?")) return

    setDeletingId(referralId)
    try {
      const { error } = await supabase.from("referrals").delete().eq("id", referralId)

      if (error) throw error
      onRefresh()
    } catch (error) {
      console.error("Error deleting referral:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (referrals.length === 0) {
    return <div className="text-center py-8 text-gray-500">No referrals submitted yet.</div>
  }

  return (
    <div className="space-y-4">
      {referrals.map((referral) => (
        <div key={referral.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">{referral.card?.name}</h3>
                <Badge variant="outline">{referral.user?.name}</Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>{referral.click_count} clicks</span>
                </Badge>
              </div>

              <p className="text-gray-600 text-sm mb-2">{referral.user?.email}</p>

              {referral.description && <p className="text-gray-700 mb-2">{referral.description}</p>}

              <div className="text-sm text-gray-500">
                Submitted on {new Date(referral.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              <Button variant="outline" size="sm" asChild>
                <a href={referral.referral_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(referral.id)}
                disabled={deletingId === referral.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
