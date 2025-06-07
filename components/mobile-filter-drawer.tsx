"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface MobileFilterDrawerProps {
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

export function MobileFilterDrawer({ onFiltersChange }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {filters.banks.length + filters.categories.length + filters.eligibility.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </SheetTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Banks Filter */}
          <Collapsible open={expandedSections.banks} onOpenChange={() => toggleSection("banks")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Banks</h3>
              {expandedSections.banks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 px-3">
              {BANKS.map((bank) => (
                <div key={bank} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-bank-${bank}`}
                    checked={filters.banks.includes(bank)}
                    onCheckedChange={() => toggleArrayFilter("banks", bank)}
                  />
                  <label
                    htmlFor={`mobile-bank-${bank}`}
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
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Categories</h3>
              {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 px-3">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleArrayFilter("categories", category)}
                  />
                  <label
                    htmlFor={`mobile-category-${category}`}
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
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Credit Requirements</h3>
              {expandedSections.eligibility ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 px-3">
              {ELIGIBILITY.map((eligibility) => (
                <div key={eligibility} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-eligibility-${eligibility}`}
                    checked={filters.eligibility.includes(eligibility)}
                    onCheckedChange={() => toggleArrayFilter("eligibility", eligibility)}
                  />
                  <label
                    htmlFor={`mobile-eligibility-${eligibility}`}
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
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Annual Fee Range</h3>
              {expandedSections.fees ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 px-3">
              <div className="px-2">
                <Slider
                  value={filters.feeRange}
                  onValueChange={(value) => updateFilter("feeRange", value as [number, number])}
                  max={1000}
                  min={0}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>${filters.feeRange[0]}</span>
                  <span>${filters.feeRange[1]}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Apply Button */}
          <Button onClick={() => setOpen(false)} className="w-full">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
