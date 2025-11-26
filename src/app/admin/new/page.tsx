"use client"

import { useRouter } from "next/navigation"
import { ProjectForm } from "@/components/project-form"
import { createProject } from "@/lib/projects-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProjectFormData } from "@/lib/types"

export default function NewProjectPage() {
    const router = useRouter()

    const handleCreate = async (data: ProjectFormData) => {
        const createData = {
            title: data.title,
            description: data.description,
            image_url: data.imageUrl,
            github_url: data.githubUrl || null,
            live_url: data.liveUrl || null,
            tags: data.tags,
            featured: data.featured,
        }

        const result = await createProject(createData)

        if (result.success) {
            router.push("/admin")
            router.refresh()
        }
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
                        <h1 className="text-lg font-bold">Create New Project</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <ProjectForm
                        onSubmit={handleCreate}
                        onCancel={() => router.push("/admin")}
                        submitLabel="Create Project"
                    />
                </div>
            </main>
        </div>
    )
}
