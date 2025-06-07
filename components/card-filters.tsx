"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface CardFiltersProps {
  onFiltersChange: (filters: {
    bank?: string
    category?: string
    eligibility?: string
  }) => void
}

const BANKS = ["Chase", "Capital One", "Citi", "Discover", "American Express", "Bank of America"]
const CATEGORIES = ["Travel", "Cashback", "Dining", "Student", "Business", "Gas"]
const ELIGIBILITY = ["Student", "Fair Credit", "Good Credit", "Excellent Credit", "Business"]

export function CardFilters({ onFiltersChange }: CardFiltersProps) {
  const [filters, setFilters] = useState<{
    bank?: string
    category?: string
    eligibility?: string
  }>({})

  const updateFilter = (key: string, value: string | undefined) => {
    const newFilters = { ...filters }
    if (value && value !== "all") {
      newFilters[key as keyof typeof filters] = value
    } else {
      delete newFilters[key as keyof typeof filters]
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="font-medium text-gray-900">Filter Cards:</h3>

        <Select value={filters.bank || "all"} onValueChange={(value) => updateFilter("bank", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Banks</SelectItem>
            {BANKS.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category || "all"} onValueChange={(value) => updateFilter("category", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.eligibility || "all"} onValueChange={(value) => updateFilter("eligibility", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Eligibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Eligibility</SelectItem>
            {ELIGIBILITY.map((eligibility) => (
              <SelectItem key={eligibility} value={eligibility}>
                {eligibility}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
