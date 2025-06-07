"use client"

import { useState, useEffect } from "react"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { PaginatedCardGrid } from "@/components/paginated-card-grid"
import { ModernFilters } from "@/components/modern-filters"
import { MobileFilterDrawer } from "@/components/mobile-filter-drawer"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ExplorePage() {
  const [cards, setCards] = useState<Card[]>([])
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCards()
  }, [])

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

  if (loading) {
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
        {/* Hero Section - Desktop Only */}
        <div className="text-center mb-12 hidden md:block">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Explore All
            <span className="text-gradient block md:inline"> Credit Cards</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Browse our complete collection of community-submitted credit cards. Find the perfect match for your
            financial needs.
          </p>

          {/* Search Bar - Desktop */}
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
        </div>

        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore Cards</h1>

          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-2xl border-0 shadow-sm bg-white"
            />
          </div>
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <ModernFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Cards Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                  All Cards
                  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {filteredCards.length}
                  </span>
                </h2>
                <p className="text-gray-600 mt-1 hidden md:block">Complete collection of community cards</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Mobile Filter Button */}
                <MobileFilterDrawer onFiltersChange={handleFiltersChange} />
                <Button variant="outline" size="sm" onClick={() => fetchCards()} className="rounded-xl">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Cards */}
            <PaginatedCardGrid cards={filteredCards} />
          </div>
        </div>
      </div>
    </div>
  )
}
