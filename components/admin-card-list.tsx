"use client"

import { useState } from "react"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink } from "lucide-react"

interface AdminCardListProps {
  cards: Card[]
  onEdit: (card: Card) => void
  onRefresh: () => void
}

export function AdminCardList({ cards, onEdit, onRefresh }: AdminCardListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card? This will also delete all associated referrals.")) {
      return
    }

    setDeletingId(cardId)
    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId)

      if (error) throw error
      onRefresh()
    } catch (error) {
      console.error("Error deleting card:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (cards.length === 0) {
    return <div className="text-center py-8 text-gray-500">No cards found. Create your first card to get started.</div>
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div key={card.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">{card.name}</h3>
                <Badge variant="outline">{card.bank}</Badge>
                <Badge variant="secondary">{card.category}</Badge>
              </div>

              <p className="text-gray-600 text-sm mb-2">{card.benefits.substring(0, 150)}...</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Joining: {card.joining_fee === 0 ? "Free" : `$${card.joining_fee}`}</span>
                <span>Annual: {card.annual_fee === 0 ? "Free" : `$${card.annual_fee}`}</span>
                <span>Eligibility: {card.eligibility}</span>
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              {card.referral_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onEdit(card)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(card.id)}
                disabled={deletingId === card.id}
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
