"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { Profile } from "@/lib/types"

interface ProfileFormProps {
    initialData?: Profile | null
    onSubmit: (data: { headline: string; bio: string }) => Promise<void>
    onCancel: () => void
}

export function ProfileForm({ initialData, onSubmit, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState({
        headline: initialData?.headline || "",
        bio: initialData?.bio || "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

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
            <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => setFormData((prev) => ({ ...prev, headline: e.target.value }))}
                    placeholder="e.g., Building digital experiences that matter."
                    required
                />
                <p className="text-sm text-muted-foreground">
                    This is the large text displayed at the top of your portfolio.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="e.g., A collection of my professional projects..."
                    rows={4}
                    required
                />
                <p className="text-sm text-muted-foreground">
                    A short description about yourself and your work.
                </p>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Profile
                </Button>
            </div>
        </form>
    )
}
