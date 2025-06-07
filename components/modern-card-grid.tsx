import type { Card } from "@/lib/types"
import { ModernCardItem } from "./modern-card-item"

interface ModernCardGridProps {
  cards: Card[]
}

export function ModernCardGrid({ cards }: ModernCardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">💳</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No cards match your current criteria. Try adjusting your filters or be the first to submit a card!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <ModernCardItem key={card.id} card={card} index={index} />
      ))}
    </div>
  )
}
