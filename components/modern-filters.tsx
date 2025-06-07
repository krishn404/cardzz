"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ModernFiltersProps {
  onFiltersChange: (filters: {
    banks?: string[]
    categories?: string[]
    eligibility?: string[]
    feeRange?: [number, number]
  }) => void
}

const BANKS = ["Chase", "Capital One", "Citi", "Discover", "American Express", "Bank of America"]
const CATEGORIES = ["Travel", "Cashback", "Dining", "Student", "Business", "Gas"]
const ELIGIBILITY = ["Student", "Fair Credit", "Good Credit", "Excellent Credit", "Business"]

export function ModernFilters({ onFiltersChange }: ModernFiltersProps) {
  const [filters, setFilters] = useState<{
    banks: string[]
    categories: string[]
    eligibility: string[]
    feeRange: [number, number]
  }>({
    banks: [],
    categories: [],
    eligibility: [],
    feeRange: [0, 1000],
  })

  const [expandedSections, setExpandedSections] = useState({
    banks: true,
    categories: true,
    eligibility: true,
    fees: true,
  })

  const updateFilter = (type: keyof typeof filters, value: any) => {
    const newFilters = { ...filters, [type]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = (type: "banks" | "categories" | "eligibility", value: string) => {
    const currentArray = filters[type]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(type, newArray)
  }

  const clearFilters = () => {
    const clearedFilters = {
      banks: [],
      categories: [],
      eligibility: [],
      feeRange: [0, 1000] as [number, number],
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.banks.length > 0 ||
    filters.categories.length > 0 ||
    filters.eligibility.length > 0 ||
    filters.feeRange[0] > 0 ||
    filters.feeRange[1] < 1000

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <Card className="w-full lg:w-80 h-fit sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.banks.map((bank) => (
              <Badge key={bank} variant="secondary" className="text-xs">
                {bank}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleArrayFilter("banks", bank)} />
              </Badge>
            ))}
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleArrayFilter("categories", category)} />
              </Badge>
            ))}
            {filters.eligibility.map((eligibility) => (
              <Badge key={eligibility} variant="secondary" className="text-xs">
                {eligibility}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => toggleArrayFilter("eligibility", eligibility)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Banks Filter */}
        <Collapsible open={expandedSections.banks} onOpenChange={() => toggleSection("banks")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="font-semibold text-sm">Banks</h3>
            {expandedSections.banks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {BANKS.map((bank) => (
              <div key={bank} className="flex items-center space-x-2">
                <Checkbox
                  id={`bank-${bank}`}
                  checked={filters.banks.includes(bank)}
                  onCheckedChange={() => toggleArrayFilter("banks", bank)}
                />
                <label
                  htmlFor={`bank-${bank}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {bank}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Categories Filter */}
        <Collapsible open={expandedSections.categories} onOpenChange={() => toggleSection("categories")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="font-semibold text-sm">Categories</h3>
            {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter("categories", category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Eligibility Filter */}
        <Collapsible open={expandedSections.eligibility} onOpenChange={() => toggleSection("eligibility")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="font-semibold text-sm">Credit Requirements</h3>
            {expandedSections.eligibility ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {ELIGIBILITY.map((eligibility) => (
              <div key={eligibility} className="flex items-center space-x-2">
                <Checkbox
                  id={`eligibility-${eligibility}`}
                  checked={filters.eligibility.includes(eligibility)}
                  onCheckedChange={() => toggleArrayFilter("eligibility", eligibility)}
                />
                <label
                  htmlFor={`eligibility-${eligibility}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {eligibility}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Fee Range Filter */}
        <Collapsible open={expandedSections.fees} onOpenChange={() => toggleSection("fees")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="font-semibold text-sm">Annual Fee Range</h3>
            {expandedSections.fees ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="px-2">
              <Slider
                value={filters.feeRange}
                onValueChange={(value) => updateFilter("feeRange", value as [number, number])}
                max={1000}
                min={0}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>${filters.feeRange[0]}</span>
                <span>${filters.feeRange[1]}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
