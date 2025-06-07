"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Card, ReferralWithStats } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AdminCardForm } from "@/components/admin-card-form"
import { AdminCardList } from "@/components/admin-card-list"
import { AdminReferralList } from "@/components/admin-referral-list"
import { AdminPendingCards } from "@/components/admin-pending-cards"
import { Plus, Clock } from "lucide-react"
import { AdminTools } from "@/components/admin-tools"

interface CardWithUser extends Card {
  user?: {
    name: string
    email: string
  }
}

export default function AdminPage() {
  const { dbUser, loading: authLoading } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [pendingCards, setPendingCards] = useState<CardWithUser[]>([])
  const [referrals, setReferrals] = useState<ReferralWithStats[]>([])
  const [showCardForm, setShowCardForm] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dbUser?.is_admin) {
      fetchData()
    }
  }, [dbUser])

  const fetchData = async () => {
    try {
      // Fetch approved cards
      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (cardsError) throw cardsError

      // Fetch pending cards with user info
      const { data: pendingData, error: pendingError } = await supabase
        .from("cards")
        .select(`
          *,
          user:users!cards_submitted_by_fkey(name, email)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (pendingError) throw pendingError

      // Fetch referrals with click counts
      const { data: referralsData, error: referralsError } = await supabase
        .from("referrals")
        .select(`
          *,
          card:cards(name, slug),
          user:users(name, email),
          clicks(id)
        `)
        .order("created_at", { ascending: false })

      if (referralsError) throw referralsError

      const referralsWithStats = (referralsData || []).map((referral) => ({
        ...referral,
        click_count: referral.clicks?.length || 0,
      }))

      setCards(cardsData || [])
      setPendingCards(pendingData || [])
      setReferrals(referralsWithStats)
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardSaved = () => {
    setShowCardForm(false)
    setEditingCard(null)
    fetchData()
  }

  const handleEditCard = (card: Card) => {
    setEditingCard(card)
    setShowCardForm(true)
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!dbUser?.is_admin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage credit cards, user submissions, and referrals.</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending Cards</span>
            {pendingCards.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingCards.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cards">Approved Cards</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <UICard>
            <CardHeader>
              <CardTitle>Pending Card Submissions</CardTitle>
              <p className="text-gray-600">Review and approve user-submitted credit cards.</p>
            </CardHeader>
            <CardContent>
              <AdminPendingCards pendingCards={pendingCards} onRefresh={fetchData} />
            </CardContent>
          </UICard>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <UICard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Approved Credit Cards</CardTitle>
                <Button onClick={() => setShowCardForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showCardForm ? (
                <AdminCardForm
                  card={editingCard}
                  onSave={handleCardSaved}
                  onCancel={() => {
                    setShowCardForm(false)
                    setEditingCard(null)
                  }}
                />
              ) : (
                <AdminCardList cards={cards} onEdit={handleEditCard} onRefresh={fetchData} />
              )}
            </CardContent>
          </UICard>
        </TabsContent>

        <TabsContent value="referrals">
          <UICard>
            <CardHeader>
              <CardTitle>User Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminReferralList referrals={referrals} onRefresh={fetchData} />
            </CardContent>
          </UICard>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <AdminTools />
      </div>
    </div>
  )
}
