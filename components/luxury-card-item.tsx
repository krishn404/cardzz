import Link from "next/link"
import type { Card } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, User, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface LuxuryCardItemProps {
  card: Card
  index: number
}

const luxuryGradients = [
  "luxury-gradient-1",
  "luxury-gradient-2",
  "luxury-gradient-3",
  "luxury-gradient-4",
  "luxury-gradient-5",
  "luxury-gradient-6",
  "luxury-gradient-7",
  "luxury-gradient-8",
]

const bankLogos: Record<string, string> = {
  Chase: "🏦",
  "Capital One": "🏛️",
  Citi: "🏢",
  Discover: "💳",
  "American Express": "💎",
  "Bank of America": "🇺🇸",
}

export function LuxuryCardItem({ card, index }: LuxuryCardItemProps) {
  const gradientClass = luxuryGradients[index % luxuryGradients.length]
  const bankLogo = bankLogos[card.bank] || "💳"

  return (
    <div className="group relative">
      <div
        className={cn(
          "relative rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer overflow-hidden",
          gradientClass,
        )}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-white/80 font-medium bg-white/20 px-2 py-1 rounded-full">
                  {card.bank}
                </span>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <span className="text-xs text-white/80">{new Date(card.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">{card.name}</h3>
            </div>

            {/* Bank Logo */}
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl ml-4 shadow-lg">
              {bankLogo}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/25 text-white hover:bg-white/35 text-xs font-medium border-0">
              {card.category}
            </Badge>
            <Badge className="bg-white/15 text-white/90 hover:bg-white/25 text-xs border-white/30">
              {card.eligibility.split(" ")[0]} {card.eligibility.split(" ")[1]}
            </Badge>
            {card.annual_fee === 0 && (
              <Badge className="bg-emerald-500/30 text-white hover:bg-emerald-500/40 text-xs border-0">
                No Annual Fee
              </Badge>
            )}
          </div>

          {/* Benefits Preview */}
          <p className="text-sm text-white/90 line-clamp-2 mb-4 leading-relaxed">{card.benefits}</p>

          {/* Fee Information */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center space-x-1 bg-white/15 px-3 py-2 rounded-xl">
              <DollarSign className="h-4 w-4 text-white/80" />
              <span className="text-white font-medium">
                {card.annual_fee === 0 ? "Free" : `$${card.annual_fee}/year`}
              </span>
            </div>
            {card.joining_fee > 0 && (
              <div className="text-white/80 text-xs bg-white/10 px-2 py-1 rounded-lg">Joining: ${card.joining_fee}</div>
            )}
          </div>

          {/* Submitter Info */}
          {card.user && (
            <div className="flex items-center text-xs text-white/70 mb-4 bg-white/10 px-3 py-2 rounded-xl">
              <User className="h-3 w-3 mr-2" />
              <span>Shared by {card.user.name}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              asChild
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-2xl h-12 backdrop-blur-sm border-0 shadow-lg"
            >
              <Link href={`/cards/${card.slug}`}>View Details</Link>
            </Button>
            {card.referral_url && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-white/15 border-white/30 hover:bg-white/25 text-white rounded-2xl px-4 h-12 backdrop-blur-sm"
              >
                <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  )
}
