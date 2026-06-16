"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkles, LinkIcon, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AIAssistantPage() {
  const [urlInput, setUrlInput] = useState("")
  const [urlResult, setUrlResult] = useState("")
  const [isUrlLoading, setIsUrlLoading] = useState(false)

  const [titleInput, setTitleInput] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [descResult, setDescResult] = useState("")
  const [isDescLoading, setIsDescLoading] = useState(false)

  const { toast } = useToast()

  const handleSummarizeUrl = async () => {
    if (!urlInput.trim()) return

    setIsUrlLoading(true)
    setUrlResult("")
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      })

      if (!response.ok) throw new Error("Failed to summarize")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader found on response body")

      const decoder = new TextDecoder()
      let accumulatedText = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk
        setUrlResult(accumulatedText)
      }

      toast({
        title: "URL Summarized",
        description: "AI has analyzed the link successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize URL",
        variant: "destructive",
      })
    } finally {
      setIsUrlLoading(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!titleInput.trim()) return

    setIsDescLoading(true)
    setDescResult("")
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleInput, tags }),
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()
      setDescResult(data.description)
      toast({
        title: "Description Generated",
        description: "AI has created a project description",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      })
    } finally {
      setIsDescLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Assistant</h1>
                <p className="text-muted-foreground">Use AI to generate descriptions and summaries for your projects</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Summarize URL</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Paste a project URL and AI will visit the page and create a description
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">Project URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url-input"
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://github.com/username/project"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSummarizeUrl()
                        }
                      }}
                    />
                    <Button onClick={handleSummarizeUrl} disabled={isUrlLoading || !urlInput.trim()}>
                      {isUrlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Summarize"}
                    </Button>
                  </div>
                </div>

                {urlResult && (
                  <div className="space-y-2">
                    <Label>Generated Summary</Label>
                    <Textarea value={urlResult} onChange={(e) => setUrlResult(e.target.value)} rows={4} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(urlResult)
                        toast({ title: "Copied to clipboard" })
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Generate Description</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Provide project details and AI will create a professional description
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title-input">Project Title</Label>
                  <Input
                    id="title-input"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags-input">Tags (comma-separated)</Label>
                  <Input
                    id="tags-input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, TypeScript, Next.js"
                  />
                </div>

                <Button
                  onClick={handleGenerateDescription}
                  disabled={isDescLoading || !titleInput.trim()}
                  className="w-full"
                >
                  {isDescLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Description
                    </>
                  )}
                </Button>

                {descResult && (
                  <div className="space-y-2">
                    <Label>Generated Description</Label>
                    <Textarea value={descResult} onChange={(e) => setDescResult(e.target.value)} rows={4} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(descResult)
                        toast({ title: "Copied to clipboard" })
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
