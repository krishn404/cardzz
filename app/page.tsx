"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { PaginatedCardGrid } from "@/components/paginated-card-grid"
import { ModernFilters } from "@/components/modern-filters"
import { MobileFilterDrawer } from "@/components/mobile-filter-drawer"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Plus, Users, AlertCircle, RefreshCw, TrendingUp, Award, Zap, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { LuxuryCardItem } from "@/components/luxury-card-item"
import { ArrowRight } from "lucide-react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function HomePage() {
  const { user, dbUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [cards, setCards] = useState<Card[]>([])
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLanding, setShowLanding] = useState(false)

  useEffect(() => {
    // Show landing page for new users or if no user is signed in
    if (!authLoading && !user) {
      setShowLanding(true)
      router.push("/landing")
      return
    }

    if (!authLoading) {
      fetchCards()
    }
  }, [authLoading, user, router])

  useEffect(() => {
    // Apply search filter
    if (searchQuery.trim()) {
      const filtered = cards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.benefits.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCards(filtered)
    } else {
      setFilteredCards(cards)
    }
  }, [searchQuery, cards])

  const fetchCards = async (silent = false) => {
    try {
      if (!silent) {
        setError(null)
        setLoading(true)
      }

      const { data, error: fetchError } = await supabase
        .from("cards")
        .select(`
          *,
          user:users!cards_submitted_by_fkey(name)
        `)
        .in("status", ["approved", "pending"])
        .order("created_at", { ascending: false })

      if (fetchError) {
        throw new Error(`Database error: ${fetchError.message}`)
      }

      setCards(data || [])
      setFilteredCards(data || [])
    } catch (error: any) {
      if (!silent) {
        setError(error.message || "Failed to load cards")
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const handleFiltersChange = (filters: {
    banks?: string[]
    categories?: string[]
    eligibility?: string[]
    feeRange?: [number, number]
  }) => {
    let filtered = cards

    // Apply search first
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.benefits.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply filters
    if (filters.banks && filters.banks.length > 0) {
      filtered = filtered.filter((card) => filters.banks!.includes(card.bank))
    }
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((card) => filters.categories!.includes(card.category))
    }
    if (filters.eligibility && filters.eligibility.length > 0) {
      filtered = filtered.filter((card) => filters.eligibility!.includes(card.eligibility))
    }
    if (filters.feeRange) {
      filtered = filtered.filter(
        (card) => card.annual_fee >= filters.feeRange![0] && card.annual_fee <= filters.feeRange![1],
      )
    }

    setFilteredCards(filtered)
  }

  if (showLanding || (!authLoading && !user)) {
    return null // Will redirect to landing page
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto mobile-container py-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-12 bg-gray-200 rounded-2xl w-2/3 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded-xl w-1/2 mx-auto"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto mobile-container py-8">
        {/* Desktop Hero Section */}
        <div className="text-center mb-12 hidden md:block">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-gradient block md:inline"> Credit Card</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover the best credit cards through our community-powered marketplace. Compare benefits, earn rewards,
            and help others save money.
          </p>

          {/* Search Bar - Desktop Only */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search cards, banks, or benefits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Stats - Desktop Only */}
          <div className="flex justify-center items-center space-x-8 text-sm md:text-base">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{cards.length}+</div>
              <div className="text-gray-600">Credit Cards</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">100%</div>
              <div className="text-gray-600">Community Driven</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">Free</div>
              <div className="text-gray-600">To Use</div>
            </div>
          </div>
        </div>

        {/* Mobile Header - Simple */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Recommended for You</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8 rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" onClick={() => fetchCards()} className="ml-2">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Desktop Community CTA */}
        {user && dbUser && (
          <UICard className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white overflow-hidden relative rounded-3xl luxury-shadow hidden md:block">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-6 md:p-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Share Your Favorite Card</h3>
                    <p className="text-blue-100 text-base md:text-lg">
                      Help the community grow by submitting your referral link and earn rewards together.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-2xl"
                  >
                    <Link href="/submit-card">
                      <Plus className="h-5 w-5 mr-2" />
                      Submit Card
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-white/30 text-black hover:bg-white/10 rounded-2xl"
                  >
                    <Link href="/my-submissions">View My Cards</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </UICard>
        )}

        {/* Desktop Features for non-users */}
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 hidden md:grid">
            <UICard className="text-center p-6 border-0 luxury-shadow-sm bg-white/80 backdrop-blur-sm rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Community Driven</h3>
              <p className="text-gray-600">Real users sharing real experiences with credit cards</p>
            </UICard>
            <UICard className="text-center p-6 border-0 luxury-shadow-sm bg-white/80 backdrop-blur-sm rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Earn Rewards</h3>
              <p className="text-gray-600">Help others while earning referral bonuses</p>
            </UICard>
            <UICard className="text-center p-6 border-0 luxury-shadow-sm bg-white/80 backdrop-blur-sm rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Instant Access</h3>
              <p className="text-gray-600">Browse and apply immediately with no waiting</p>
            </UICard>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <ModernFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Cards Grid */}
          <div className="flex-1">
            {/* Desktop Header */}
            <div className="flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 hidden md:flex">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Recommended Cards
                  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {filteredCards.length}
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">Find the perfect card for your needs</p>
              </div>
              <div className="flex items-center space-x-3">
                <MobileFilterDrawer onFiltersChange={handleFiltersChange} />
                <Button variant="outline" size="sm" onClick={() => fetchCards()} className="rounded-xl">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Mobile: Show limited cards, Desktop: Show all with pagination */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-6">
                {filteredCards.slice(0, 6).map((card, index) => (
                  <LuxuryCardItem key={card.id} card={card} index={index} />
                ))}
              </div>
              {filteredCards.length > 6 && (
                <div className="text-center mt-8">
                  <Button asChild className="rounded-2xl">
                    <Link href="/explore">
                      View All {filteredCards.length} Cards
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop: Full pagination */}
            <div className="hidden md:block">
              <PaginatedCardGrid cards={filteredCards} />
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}
