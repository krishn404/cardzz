"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

interface ReferralFormProps {
  cardId: string
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ReferralForm({ cardId, userId, onSuccess, onCancel }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    referral_url: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.from("referrals").insert({
        card_id: cardId,
        user_id: userId,
        referral_url: formData.referral_url,
        description: formData.description,
      })

      if (error) throw error
      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label htmlFor="referral_url">Referral URL *</Label>
        <Input
          id="referral_url"
          type="url"
          value={formData.referral_url}
          onChange={(e) => setFormData({ ...formData, referral_url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Share why you recommend this card..."
          rows={3}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Referral"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
