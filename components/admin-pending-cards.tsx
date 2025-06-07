"use client"

import { useState } from "react"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface CardWithUser extends Card {
  user?: {
    name: string
    email: string
  }
}

interface AdminPendingCardsProps {
  pendingCards: CardWithUser[]
  onRefresh: () => void
}

export function AdminPendingCards({ pendingCards, onRefresh }: AdminPendingCardsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleApprove = async (cardId: string) => {
    setProcessingId(cardId)
    try {
      const { error } = await supabase.from("cards").update({ status: "approved" }).eq("id", cardId)

      if (error) throw error

      setMessage({ type: "success", text: "Card approved successfully! It will now appear in the browse section." })
      onRefresh()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setProcessingId(null)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleReject = async (cardId: string) => {
    if (!confirm("Are you sure you want to reject this card? This action cannot be undone.")) {
      return
    }

    setProcessingId(cardId)
    try {
      const { error } = await supabase.from("cards").update({ status: "rejected" }).eq("id", cardId)

      if (error) throw error

      setMessage({ type: "success", text: "Card rejected successfully." })
      onRefresh()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setProcessingId(null)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (pendingCards.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No pending card submissions to review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-blue-800 mb-2">Admin Review Instructions</h3>
        <p className="text-sm text-blue-700">
          Review each card submission carefully. Approve cards that meet our quality standards and have accurate
          information. Rejected cards will be marked as rejected but not deleted from the database.
        </p>
      </div>

      {pendingCards.map((card) => (
        <UICard key={card.id} className="border-orange-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{card.name}</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </CardTitle>
                <p className="text-gray-600">
                  {card.bank} • {card.category}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted by: {card.user?.name} ({card.user?.email})
                </p>
                <p className="text-xs text-gray-500">Submitted on: {new Date(card.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(card.id)}
                  disabled={processingId === card.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(card.id)}
                  disabled={processingId === card.id}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <Image
                  src={card.image_url || "/placeholder.svg?height=150&width=200"}
                  alt={card.name}
                  width={200}
                  height={150}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="md:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Eligibility</p>
                    <p className="text-sm text-gray-600">{card.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fees</p>
                    <p className="text-sm text-gray-600">
                      Joining: {card.joining_fee === 0 ? "Free" : `$${card.joining_fee}`} • Annual:{" "}
                      {card.annual_fee === 0 ? "Free" : `$${card.annual_fee}`}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Benefits</p>
                  <p className="text-sm text-gray-600">{card.benefits}</p>
                </div>

                {card.description && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes</p>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Referral URL</p>
                  <div className="flex items-center">
                    <a
                      href={card.referral_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all mr-2"
                    >
                      {card.referral_url}
                    </a>
                    <Button variant="outline" size="sm" asChild className="ml-2">
                      <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </UICard>
      ))}
    </div>
  )
}
