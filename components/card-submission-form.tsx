"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { submitCard, validateCardData } from "@/app/actions/submit-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Upload, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

const BANKS = [
  "Chase",
  "Capital One",
  "Citi",
  "Discover",
  "American Express",
  "Bank of America",
  "Wells Fargo",
  "US Bank",
  "Barclays",
  "HSBC",
  "Other",
]

const CATEGORIES = [
  "Travel",
  "Cashback",
  "Dining",
  "Gas",
  "Groceries",
  "Shopping",
  "Business",
  "Student",
  "Secured",
  "Balance Transfer",
  "Other",
]

const ELIGIBILITY = [
  "Excellent Credit (750+)",
  "Good Credit (670-749)",
  "Fair Credit (580-669)",
  "Poor Credit (300-579)",
  "Student",
  "Business Owner",
  "No Credit History",
]

interface CardSubmissionFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CardSubmissionForm({ onSuccess, onCancel }: CardSubmissionFormProps) {
  const { user, dbUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    bank: "",
    category: "",
    eligibility: "",
    benefits: "",
    referral_url: "",
    joining_fee: 0,
    annual_fee: 0,
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Real-time validation
  useEffect(() => {
    if (submitAttempted) {
      const validateAsync = async () => {
        const validationErrors = await validateCardData(formData)
        setErrors(validationErrors)
      }
      validateAsync()
    }
  }, [formData, submitAttempted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!user || !dbUser) {
      setErrors({ general: "Please sign in to submit a card" })
      return
    }

    // Validate form data
    const validationErrors = await validateCardData(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await submitCard({
        ...formData,
        firebase_uid: user.uid,
      })

      if (!result.success) {
        throw new Error(result.error || "Submission failed")
      }

      setSuccess(true)

      // Reset form
      setFormData({
        name: "",
        bank: "",
        category: "",
        eligibility: "",
        benefits: "",
        referral_url: "",
        joining_fee: 0,
        annual_fee: 0,
        description: "",
      })
      setSubmitAttempted(false)

      // Redirect after success
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 2000)
      }
    } catch (error: any) {
      setErrors({
        general: error.message || "Failed to submit card. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto border-0 luxury-shadow rounded-3xl">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Card Submitted Successfully!</h3>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Your card has been added to the marketplace and is now visible to all users. Thank you for contributing to
            our community!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-2xl">
              Submit Another Card
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl"
            >
              View in Browse Cards
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto border-0 luxury-shadow rounded-3xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="flex items-center justify-center space-x-3 text-2xl md:text-3xl">
          <Upload className="h-8 w-8 text-blue-500" />
          <span>Submit Your Credit Card</span>
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Share a credit card with the community. Your submission will be immediately available for others to see.
        </p>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.general && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Card Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chase Sapphire Preferred"
                className={`mt-2 h-12 rounded-2xl ${errors.name ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            {/* Bank */}
            <div>
              <Label htmlFor="bank" className="text-base font-semibold">
                Issuing Bank *
              </Label>
              <Select
                value={formData.bank}
                onValueChange={(value) => setFormData({ ...formData, bank: value })}
                disabled={loading}
              >
                <SelectTrigger className={`mt-2 h-12 rounded-2xl ${errors.bank ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bank && <p className="text-red-500 text-sm mt-2">{errors.bank}</p>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-base font-semibold">
                Card Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
              >
                <SelectTrigger className={`mt-2 h-12 rounded-2xl ${errors.category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>

            {/* Eligibility */}
            <div>
              <Label htmlFor="eligibility" className="text-base font-semibold">
                Credit Requirement *
              </Label>
              <Select
                value={formData.eligibility}
                onValueChange={(value) => setFormData({ ...formData, eligibility: value })}
                disabled={loading}
              >
                <SelectTrigger className={`mt-2 h-12 rounded-2xl ${errors.eligibility ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select eligibility" />
                </SelectTrigger>
                <SelectContent>
                  {ELIGIBILITY.map((eligibility) => (
                    <SelectItem key={eligibility} value={eligibility}>
                      {eligibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eligibility && <p className="text-red-500 text-sm mt-2">{errors.eligibility}</p>}
            </div>

            {/* Referral URL */}
            <div>
              <Label htmlFor="referral_url" className="text-base font-semibold">
                Your Referral Link *
              </Label>
              <Input
                id="referral_url"
                type="url"
                value={formData.referral_url}
                onChange={(e) => setFormData({ ...formData, referral_url: e.target.value })}
                placeholder="https://..."
                className={`mt-2 h-12 rounded-2xl ${errors.referral_url ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.referral_url && <p className="text-red-500 text-sm mt-2">{errors.referral_url}</p>}
              <p className="text-sm text-gray-500 mt-2">
                This is your personal referral link that others will use to apply
              </p>
            </div>

            {/* Joining Fee */}
            <div>
              <Label htmlFor="joining_fee" className="text-base font-semibold">
                Joining Fee ($)
              </Label>
              <Input
                id="joining_fee"
                type="number"
                min="0"
                max="10000"
                value={formData.joining_fee}
                onChange={(e) => setFormData({ ...formData, joining_fee: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
                className={`mt-2 h-12 rounded-2xl ${errors.joining_fee ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.joining_fee && <p className="text-red-500 text-sm mt-2">{errors.joining_fee}</p>}
            </div>

            {/* Annual Fee */}
            <div>
              <Label htmlFor="annual_fee" className="text-base font-semibold">
                Annual Fee ($)
              </Label>
              <Input
                id="annual_fee"
                type="number"
                min="0"
                max="10000"
                value={formData.annual_fee}
                onChange={(e) => setFormData({ ...formData, annual_fee: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
                className={`mt-2 h-12 rounded-2xl ${errors.annual_fee ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.annual_fee && <p className="text-red-500 text-sm mt-2">{errors.annual_fee}</p>}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label htmlFor="benefits" className="text-base font-semibold">
              Card Benefits & Features *
            </Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Describe the card's benefits, rewards, sign-up bonuses, etc. Be detailed to help others understand the value proposition."
              rows={4}
              className={`mt-2 rounded-2xl ${errors.benefits ? "border-red-500" : ""}`}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.benefits && <p className="text-red-500 text-sm">{errors.benefits}</p>}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.benefits.length}/50 characters minimum (max 2000)
              </p>
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <Label htmlFor="description" className="text-base font-semibold">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional information about your experience with this card, tips for approval, etc."
              rows={3}
              className="mt-2 rounded-2xl"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Submit Card
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="h-12 rounded-2xl"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
