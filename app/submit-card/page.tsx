"use client"

import { useAuth } from "@/lib/auth-context"
import { CardSubmissionForm } from "@/components/card-submission-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { LogIn, AlertCircle, Plus, Sparkles } from "lucide-react"

export default function SubmitCardPage() {
  const { user, dbUser, loading, error } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto mobile-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-2xl w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-2xl mx-auto mobile-container py-16">
          <Alert variant="destructive" className="rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Authentication error: {error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!user || !dbUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-2xl mx-auto mobile-container py-16">
          <Card className="border-0 luxury-shadow rounded-3xl overflow-hidden">
            <CardContent className="text-center p-8 md:p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Please sign in with your Google account to submit a credit card to our community marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/")} variant="outline" className="rounded-2xl">
                  Go to Homepage
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl"
                >
                  Browse Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto mobile-container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Submit a Credit Card</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Help grow our community by sharing a credit card and your referral link. Your submission will be immediately
            available for everyone to see.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl luxury-shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Instant Publishing</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl luxury-shadow-sm">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Earn Referral Rewards</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl luxury-shadow-sm">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Help the Community</span>
            </div>
          </div>
        </div>

        <CardSubmissionForm onSuccess={() => router.push("/")} onCancel={() => router.push("/")} />
      </div>
    </div>
  )
}
