import { notFound } from "next/navigation"
import Image from "next/image"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReferralSection } from "@/components/referral-section"
import { ExternalLink, DollarSign, CreditCard, User } from "lucide-react"

interface CardDetailPageProps {
  params: {
    slug: string
  }
}

async function getCard(slug: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from("cards")
    .select(`
      *,
      user:users!cards_submitted_by_fkey(name)
    `)
    .eq("slug", slug)
    .single()

  if (error) return null
  return data
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const card = await getCard(params.slug)

  if (!card) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Image
                src={card.image_url || "/placeholder.svg?height=200&width=300"}
                alt={card.name}
                width={300}
                height={200}
                className="w-full rounded-lg"
              />
            </div>

            <div className="md:w-2/3">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{card.name}</h1>
                <p className="text-lg text-gray-600">{card.bank}</p>

                {/* Display submitter if available */}
                {card.user && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>Submitted by: {card.user.name}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="default">{card.category}</Badge>
                <Badge variant="outline">{card.eligibility}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Joining Fee</p>
                    <p className="font-semibold">{card.joining_fee === 0 ? "Free" : `$${card.joining_fee}`}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Annual Fee</p>
                    <p className="font-semibold">{card.annual_fee === 0 ? "Free" : `$${card.annual_fee}`}</p>
                  </div>
                </div>
              </div>

              {card.referral_url && (
                <Button asChild className="w-full md:w-auto">
                  <a href={card.referral_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get This Card
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Features</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{card.benefits}</p>
            </div>
          </div>

          {/* Display additional description if available */}
          {card.description && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
              <p className="text-gray-700 whitespace-pre-line">{card.description}</p>
            </div>
          )}
        </div>
      </div>

      <ReferralSection cardId={card.id} />
    </div>
  )
}

export async function generateMetadata({ params }: CardDetailPageProps) {
  const card = await getCard(params.slug)

  if (!card) {
    return {
      title: "Card Not Found",
    }
  }

  return {
    title: `${card.name} - ${card.bank} | Cardzz`,
    description: card.benefits.substring(0, 160),
  }
}
