import type { Card } from "@/lib/types"
import { CardItem } from "./card-item"

interface CardGridProps {
  cards: Card[]
}

export function CardGrid({ cards }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No cards found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  )
}
