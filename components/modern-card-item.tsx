import Link from "next/link"
import type { Card } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, User, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernCardItemProps {
  card: Card
  index: number
}

const cardBackgrounds = [
  "card-gradient-1", // Peach
  "card-gradient-2", // Mint
  "card-gradient-3", // Purple
  "card-gradient-4", // Blue
  "card-gradient-5", // Pink
  "card-gradient-6", // Gray
]

const bankLogos: Record<string, string> = {
  Chase: "🏦",
  "Capital One": "🏛️",
  Citi: "🏢",
  Discover: "💳",
  "American Express": "💎",
  "Bank of America": "🇺🇸",
}

export function ModernCardItem({ card, index }: ModernCardItemProps) {
  const backgroundClass = cardBackgrounds[index % cardBackgrounds.length]
  const bankLogo = bankLogos[card.bank] || "💳"

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer",
        backgroundClass,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-600 font-medium">{card.bank}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-600">{new Date(card.created_at).toLocaleDateString()}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-800 transition-colors">
            {card.name}
          </h3>
        </div>

        {/* Bank Logo */}
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl ml-4">
          {bankLogo}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="bg-white/30 text-gray-800 hover:bg-white/40 text-xs font-medium">
          {card.category}
        </Badge>
        <Badge variant="outline" className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 text-xs">
          {card.eligibility.split(" ")[0]} {card.eligibility.split(" ")[1]}
        </Badge>
        {card.annual_fee === 0 && (
          <Badge className="bg-green-500/20 text-green-800 hover:bg-green-500/30 text-xs">No Annual Fee</Badge>
        )}
      </div>

      {/* Benefits Preview */}
      <p className="text-sm text-gray-700 line-clamp-2 mb-4 leading-relaxed">{card.benefits}</p>

      {/* Fee Information */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700 font-medium">
            Annual: {card.annual_fee === 0 ? "Free" : `$${card.annual_fee}`}
          </span>
        </div>
        {card.joining_fee > 0 && <div className="text-gray-600">Joining: ${card.joining_fee}</div>}
      </div>

      {/* Submitter Info */}
      {card.user && (
        <div className="flex items-center text-xs text-gray-600 mb-4">
          <User className="h-3 w-3 mr-1" />
          <span>Submitted by {card.user.name}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button asChild className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl h-10">
          <Link href={`/cards/${card.slug}`}>Details</Link>
        </Button>
        {card.referral_url && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-white/30 border-white/40 hover:bg-white/50 text-gray-800 rounded-xl px-3"
          >
            <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
