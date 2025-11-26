"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProjectForm } from "@/components/project-form"
import { updateProject, getProject } from "@/lib/projects-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Project, ProjectFormData } from "@/lib/types"

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadProject() {
            if (params.id) {
                const projectData = await getProject(params.id as string)
                if (projectData) {
                    setProject(projectData)
                } else {
                    // Handle error or redirect
                    router.push("/admin")
                }
                setIsLoading(false)
            }
        }
        loadProject()
    }, [params.id, router])

    const handleUpdate = async (data: ProjectFormData) => {
        if (!project) return

        const updateData = {
            title: data.title,
            description: data.description,
            image_url: data.imageUrl,
            github_url: data.githubUrl || null,
            live_url: data.liveUrl || null,
            tags: data.tags,
            featured: data.featured,
        }

        const result = await updateProject(project.id, updateData)

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

    if (!project) return null

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
                        <h1 className="text-lg font-bold">Edit Project: {project.title}</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <ProjectForm
                        initialData={project}
                        onSubmit={handleUpdate}
                        onCancel={() => router.push("/admin")}
                        submitLabel="Update Project"
                    />
                </div>
            </main>
        </div>
    )
}
