"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PortfolioFilterProps {
  allTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearAll: () => void
}

export function PortfolioFilter({ allTags, selectedTags, onTagToggle, onClearAll }: PortfolioFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">Filter by tags</h2>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 text-xs">
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
