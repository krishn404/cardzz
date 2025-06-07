"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Plus, ExternalLink, User, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MySubmissionsPage() {
  const { user, dbUser, loading: authLoading } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (dbUser) {
      fetchMyCards()
    }
  }, [dbUser])

  const fetchMyCards = async () => {
    if (!dbUser) return

    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from("cards")
        .select("*")
        .eq("submitted_by", dbUser.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setCards(data || [])
    } catch (error: any) {
      console.error("Error fetching my cards:", error)
      setError(error.message || "Failed to load your submissions")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border-0">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto mobile-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-2xl w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto mobile-container py-8">
          <UICard className="border-0 luxury-shadow rounded-3xl">
            <CardContent className="text-center p-8 md:p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
              <p className="text-gray-600 mb-8">Please sign in to view your submissions.</p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl"
              >
                <Link href="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </UICard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto mobile-container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">My Card Submissions</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            View and manage all the credit cards you've submitted to the community.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" onClick={fetchMyCards} className="ml-2">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Submit New Card CTA */}
        <UICard className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white overflow-hidden relative rounded-3xl luxury-shadow">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Submit Another Card</h3>
                <p className="text-blue-100">Share more cards with the community and earn additional rewards.</p>
              </div>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-2xl">
                <Link href="/submit-card">
                  <Plus className="h-5 w-5 mr-2" />
                  Submit Card
                </Link>
              </Button>
            </div>
          </CardContent>
        </UICard>

        {cards.length === 0 ? (
          <UICard className="border-0 luxury-shadow rounded-3xl">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No submissions yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                You haven't submitted any cards yet. Be the first to share your favorite credit card with the community!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl"
              >
                <Link href="/submit-card">Submit Your First Card</Link>
              </Button>
            </CardContent>
          </UICard>
        ) : (
          <div className="space-y-6">
            {cards.map((card) => (
              <UICard
                key={card.id}
                className="border-0 luxury-shadow-sm rounded-3xl overflow-hidden hover:luxury-shadow transition-all duration-300"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/4">
                      <Image
                        src={card.image_url || "/placeholder.svg?height=150&width=200"}
                        alt={card.name}
                        width={200}
                        height={150}
                        className="w-full rounded-2xl"
                      />
                    </div>
                    <div className="lg:w-3/4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{card.name}</h3>
                          <p className="text-gray-600 mb-2">
                            {card.bank} • {card.category}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(card.status)}
                            <span className="text-xs text-gray-500">
                              Submitted {new Date(card.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-4 leading-relaxed">{card.benefits}</p>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <Badge variant="secondary" className="rounded-xl">
                          {card.category}
                        </Badge>
                        <Badge variant="outline" className="rounded-xl">
                          {card.eligibility}
                        </Badge>
                        {card.annual_fee === 0 && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-xl">
                            No Annual Fee
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Annual Fee: {card.annual_fee === 0 ? "Free" : `$${card.annual_fee}`}</span>
                          {card.joining_fee > 0 && <span>Joining: ${card.joining_fee}</span>}
                        </div>
                        <div className="flex space-x-3">
                          {card.status === "approved" && (
                            <Button variant="outline" size="sm" asChild className="rounded-xl">
                              <Link href={`/cards/${card.slug}`}>View Public Page</Link>
                            </Button>
                          )}
                          {card.referral_url && (
                            <Button variant="outline" size="sm" asChild className="rounded-xl">
                              <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Referral Link
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Status Messages */}
                      {card.status === "pending" && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                          <p className="flex items-center text-sm text-amber-800">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              <strong>Pending Review:</strong> Your card submission is being reviewed by our admin team.
                              Once approved, it will appear in the browse section.
                            </span>
                          </p>
                        </div>
                      )}

                      {card.status === "rejected" && (
                        <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-2xl">
                          <p className="flex items-center text-sm text-red-800">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span>
                              <strong>Submission Rejected:</strong> Your card submission was not approved. Please
                              contact support for more information.
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </UICard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
