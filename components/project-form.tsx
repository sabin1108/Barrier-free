"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"
import type { ProjectFormData } from "@/lib/types"
import { AIDescriptionGenerator } from "@/components/ai-description-generator"
import { URLSummarizer } from "@/components/url-summarizer"
import { Separator } from "@/components/ui/separator"

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export function ProjectForm({ initialData, onSubmit, onCancel, submitLabel = "Save Project" }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    githubUrl: initialData?.githubUrl || "",
    liveUrl: initialData?.liveUrl || "",
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
  })

  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-3 sm:p-4 border border-primary/20 bg-primary/5 rounded-lg">
        <URLSummarizer onSummaryGenerated={(summary) => setFormData((prev) => ({ ...prev, description: summary }))} />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="My Awesome Project"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="A detailed description of your project..."
          rows={4}
          required
        />
        <AIDescriptionGenerator
          title={formData.title}
          tags={formData.tags}
          currentDescription={formData.description}
          onUseDescription={(description) => setFormData((prev) => ({ ...prev, description }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
          required
        />
        {formData.imageUrl && (
          <div className="mt-2 rounded-md overflow-hidden border border-border">
            <img
              src={formData.imageUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
          <Input
            id="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live Demo URL (Optional)</Label>
          <Input
            id="liveUrl"
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
            placeholder="https://demo.example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
            placeholder="Add a tag (e.g., React, TypeScript)"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} variant="secondary" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 sm:mr-0" />
            <span className="sm:hidden ml-2">Add Tag</span>
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1 w-full">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
