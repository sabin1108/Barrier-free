"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface URLSummarizerProps {
  onSummaryGenerated: (summary: string) => void
}

export function URLSummarizer({ onSummaryGenerated }: URLSummarizerProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSummarize = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to summarize",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/summarize-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Failed to summarize URL")

      const data = await response.json()
      onSummaryGenerated(data.summary)
      setUrl("")
      toast({
        title: "URL summarized",
        description: "AI has analyzed the link and generated a description",
      })
    } catch (error) {
      toast({
        title: "Summarization failed",
        description: "Could not summarize the URL. Please check the link and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="url-summarize" className="text-sm font-medium">
        AI Link Summarizer
      </Label>
      <div className="flex gap-2">
        <Input
          id="url-summarize"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a project URL to summarize with AI"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSummarize()
            }
          }}
        />
        <Button type="button" onClick={handleSummarize} disabled={isLoading || !url.trim()} className="flex-shrink-0">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <LinkIcon className="w-4 h-4 mr-2" />
              Summarize
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">AI will visit the URL and create a project description</p>
    </div>
  )
}
