import Link from "next/link"
import Image from "next/image"
import type { Card } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, User } from "lucide-react"

interface CardItemProps {
  card: Card
}

export function CardItem({ card }: CardItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.bank}</p>
          </div>
          <Image
            src={card.image_url || "/placeholder.svg?height=60&width=90"}
            alt={card.name}
            width={90}
            height={60}
            className="rounded"
          />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{card.category}</Badge>
            <Badge variant="outline">{card.eligibility}</Badge>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3">{card.benefits}</p>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Joining Fee: {card.joining_fee === 0 ? "Free" : `$${card.joining_fee}`}
            </span>
            <span className="text-gray-600">Annual Fee: {card.annual_fee === 0 ? "Free" : `$${card.annual_fee}`}</span>
          </div>

          {/* Display submitter if available */}
          {card.user && (
            <div className="flex items-center text-xs text-gray-500">
              <User className="h-3 w-3 mr-1" />
              <span>Submitted by: {card.user.name}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button asChild className="flex-1">
            <Link href={`/cards/${card.slug}`}>View Details</Link>
          </Button>
          {card.referral_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
