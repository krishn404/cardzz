"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { updateCard, validateCardData } from "@/app/actions/submit-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Edit, Loader2, X } from "lucide-react"
import type { Card as CardType } from "@/lib/types"

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

interface EditCardFormProps {
  card: CardType
  onSuccess?: () => void
  onCancel?: () => void
}

export function EditCardForm({ card, onSuccess, onCancel }: EditCardFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: card.name || "",
    bank: card.bank || "",
    category: card.category || "",
    eligibility: card.eligibility || "",
    benefits: card.benefits || "",
    referral_url: card.referral_url || "",
    joining_fee: card.joining_fee || 0,
    annual_fee: card.annual_fee || 0,
    description: card.description || "",
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

    if (!user) {
      setErrors({ general: "Please sign in to update this card" })
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
      const result = await updateCard({
        id: card.id,
        ...formData,
        firebase_uid: user.uid,
      })

      if (!result.success) {
        throw new Error(result.error || "Update failed")
      }

      setSuccess(true)

      // Call success callback after a short delay
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (error: any) {
      setErrors({
        general: error.message || "Failed to update card. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-0 luxury-shadow rounded-3xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Card Updated Successfully!</h3>
          <p className="text-gray-600 mb-6">Your changes have been saved and are now live.</p>
          <Button onClick={onCancel} className="rounded-2xl">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 luxury-shadow rounded-3xl">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <Edit className="h-6 w-6 text-blue-500" />
            <span>Edit Card</span>
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-600">Update your card information</p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Card Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chase Sapphire Preferred"
                className={`mt-1 h-10 rounded-xl ${errors.name ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Bank */}
            <div>
              <Label htmlFor="bank" className="text-sm font-semibold">
                Issuing Bank *
              </Label>
              <Select
                value={formData.bank}
                onValueChange={(value) => setFormData({ ...formData, bank: value })}
                disabled={loading}
              >
                <SelectTrigger className={`mt-1 h-10 rounded-xl ${errors.bank ? "border-red-500" : ""}`}>
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
              {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-semibold">
                Card Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
              >
                <SelectTrigger className={`mt-1 h-10 rounded-xl ${errors.category ? "border-red-500" : ""}`}>
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
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Eligibility */}
            <div>
              <Label htmlFor="eligibility" className="text-sm font-semibold">
                Credit Requirement *
              </Label>
              <Select
                value={formData.eligibility}
                onValueChange={(value) => setFormData({ ...formData, eligibility: value })}
                disabled={loading}
              >
                <SelectTrigger className={`mt-1 h-10 rounded-xl ${errors.eligibility ? "border-red-500" : ""}`}>
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
              {errors.eligibility && <p className="text-red-500 text-xs mt-1">{errors.eligibility}</p>}
            </div>

            {/* Referral URL */}
            <div>
              <Label htmlFor="referral_url" className="text-sm font-semibold">
                Your Referral Link *
              </Label>
              <Input
                id="referral_url"
                type="url"
                value={formData.referral_url}
                onChange={(e) => setFormData({ ...formData, referral_url: e.target.value })}
                placeholder="https://..."
                className={`mt-1 h-10 rounded-xl ${errors.referral_url ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.referral_url && <p className="text-red-500 text-xs mt-1">{errors.referral_url}</p>}
            </div>

            {/* Joining Fee */}
            <div>
              <Label htmlFor="joining_fee" className="text-sm font-semibold">
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
                className={`mt-1 h-10 rounded-xl ${errors.joining_fee ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.joining_fee && <p className="text-red-500 text-xs mt-1">{errors.joining_fee}</p>}
            </div>

            {/* Annual Fee */}
            <div>
              <Label htmlFor="annual_fee" className="text-sm font-semibold">
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
                className={`mt-1 h-10 rounded-xl ${errors.annual_fee ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.annual_fee && <p className="text-red-500 text-xs mt-1">{errors.annual_fee}</p>}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label htmlFor="benefits" className="text-sm font-semibold">
              Card Benefits & Features *
            </Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Describe the card's benefits, rewards, sign-up bonuses, etc."
              rows={3}
              className={`mt-1 rounded-xl ${errors.benefits ? "border-red-500" : ""}`}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.benefits && <p className="text-red-500 text-xs">{errors.benefits}</p>}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.benefits.length}/50 characters minimum (max 2000)
              </p>
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional information about your experience with this card"
              rows={2}
              className="mt-1 rounded-xl"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Card"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="h-10 rounded-xl">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
