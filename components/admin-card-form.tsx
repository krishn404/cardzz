"use client"

import type React from "react"

import { useState } from "react"
import type { Card } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminCardFormProps {
  card?: Card | null
  onSave: () => void
  onCancel: () => void
}

const BANKS = ["Chase", "Capital One", "Citi", "Discover", "American Express", "Bank of America"]
const CATEGORIES = ["Travel", "Cashback", "Dining", "Student", "Business", "Gas"]
const ELIGIBILITY = ["Student", "Fair Credit", "Good Credit", "Excellent Credit", "Business"]

export function AdminCardForm({ card, onSave, onCancel }: AdminCardFormProps) {
  const [formData, setFormData] = useState({
    name: card?.name || "",
    slug: card?.slug || "",
    bank: card?.bank || "",
    category: card?.category || "",
    eligibility: card?.eligibility || "",
    benefits: card?.benefits || "",
    referral_url: card?.referral_url || "",
    joining_fee: card?.joining_fee || 0,
    annual_fee: card?.annual_fee || 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: card ? formData.slug : generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (card) {
        // Update existing card
        const { error } = await supabase.from("cards").update(formData).eq("id", card.id)

        if (error) throw error
      } else {
        // Create new card
        const { error } = await supabase.from("cards").insert(formData)

        if (error) throw error
      }

      onSave()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Card Name *</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="bank">Bank *</Label>
          <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
            <SelectTrigger>
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
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
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
        </div>

        <div>
          <Label htmlFor="eligibility">Eligibility *</Label>
          <Select
            value={formData.eligibility}
            onValueChange={(value) => setFormData({ ...formData, eligibility: value })}
          >
            <SelectTrigger>
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
        </div>

        <div>
          <Label htmlFor="referral_url">Referral URL</Label>
          <Input
            id="referral_url"
            type="url"
            value={formData.referral_url}
            onChange={(e) => setFormData({ ...formData, referral_url: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="joining_fee">Joining Fee ($)</Label>
          <Input
            id="joining_fee"
            type="number"
            min="0"
            value={formData.joining_fee}
            onChange={(e) => setFormData({ ...formData, joining_fee: Number.parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <Label htmlFor="annual_fee">Annual Fee ($)</Label>
          <Input
            id="annual_fee"
            type="number"
            min="0"
            value={formData.annual_fee}
            onChange={(e) => setFormData({ ...formData, annual_fee: Number.parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="benefits">Benefits & Features *</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          rows={4}
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : card ? "Update Card" : "Create Card"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
