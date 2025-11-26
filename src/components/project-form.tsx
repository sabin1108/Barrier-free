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
import ReactMarkdown from "react-markdown"

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="space-y-6">
          <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
            <URLSummarizer onSummaryGenerated={(summary) => setFormData((prev) => ({ ...prev, description: summary }))} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="My Awesome Project"
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="A detailed description of your project..."
              rows={8}
              required
              className="resize-none"
            />
            <AIDescriptionGenerator
              title={formData.title}
              tags={formData.tags}
              currentDescription={formData.description}
              onUseDescription={(description) => setFormData((prev) => ({ ...prev, description }))}
            />
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
                  <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-base">Project Image</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="sticky top-24">
            <Label className="text-base mb-2 block">Preview</Label>
            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-lg aspect-video relative group">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground">
                  <div className="text-center">
                    <p>No image URL provided</p>
                    <p className="text-sm opacity-70">Enter a URL to see preview</p>
                  </div>
                </div>
              )}

              {/* Overlay Preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">{formData.title || "Project Title"}</h3>
                <div className="text-white/80 line-clamp-3 prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{formData.description || "Project description will appear here..."}</ReactMarkdown>
                </div>
                <div className="flex gap-2 mt-4">
                  {formData.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              This is how your project will look on the portfolio.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto min-w-[150px]">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
