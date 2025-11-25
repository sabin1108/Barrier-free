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

      <div className="flex flex-wrap gap-2.5">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                ${isSelected
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:scale-105 border border-transparent"}
              `}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
