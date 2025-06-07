"use client"

import { useState, useMemo } from "react"
import type { Card } from "@/lib/types"
import { LuxuryCardItem } from "./luxury-card-item"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginatedCardGridProps {
  cards: Card[]
  itemsPerPage?: number
}

export function PaginatedCardGrid({ cards, itemsPerPage = 12 }: PaginatedCardGridProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const { paginatedCards, totalPages, startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginated = cards.slice(start, end)
    const total = Math.ceil(cards.length / itemsPerPage)

    return {
      paginatedCards: paginated,
      totalPages: total,
      startIndex: start + 1,
      endIndex: Math.min(end, cards.length),
    }
  }, [cards, currentPage, itemsPerPage])

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">💳</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No cards found</h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          No cards match your current criteria. Try adjusting your filters or be the first to submit a card!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex}-{endIndex} of {cards.length} cards
        </p>
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedCards.map((card, index) => (
          <LuxuryCardItem key={card.id} card={card} index={(currentPage - 1) * itemsPerPage + index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-8">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNumber)}
                  className="w-10 h-10"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
