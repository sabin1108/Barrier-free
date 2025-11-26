"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { getProfile, updateProfile } from "@/lib/profile-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Profile } from "@/lib/types"

export default function ProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const data = await getProfile()
            setProfile(data)
            setIsLoading(false)
        }
        loadData()
    }, [])

    const handleUpdate = async (data: { headline: string; bio: string }) => {
        const result = await updateProfile(data)
        if (result.success) {
            router.push("/admin")
            router.refresh()
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Admin
                            </Link>
                        </Button>
                        <div className="h-6 w-px bg-border" />
                        <h1 className="text-lg font-bold">Edit Profile</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <ProfileForm
                        initialData={profile}
                        onSubmit={handleUpdate}
                        onCancel={() => router.push("/admin")}
                    />
                </div>
            </main>
        </div>
    )
}
