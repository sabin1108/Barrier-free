"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIDescriptionGeneratorProps {
  title: string
  tags: string[]
  currentDescription?: string
  onUseDescription: (description: string) => void
}

export function AIDescriptionGenerator({
  title,
  tags,
  currentDescription,
  onUseDescription,
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a project title first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tags,
          existingDescription: currentDescription,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate description")

      const data = await response.json()
      setGeneratedDescription(data.description)
      toast({
        title: "Description generated",
        description: "AI has created a description for your project",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDescription)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUse = () => {
    onUseDescription(generatedDescription)
    toast({
      title: "Description applied",
      description: "The AI-generated description has been added to your project",
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">AI Description Generator</Label>
        <Button
          type="button"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim()}
          variant="outline"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      {generatedDescription && (
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              rows={4}
              className="pr-10"
            />
            <Button type="button" size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button type="button" size="sm" onClick={handleUse} className="w-full">
            Use This Description
          </Button>
        </div>
      )}
    </div>
  )
}
