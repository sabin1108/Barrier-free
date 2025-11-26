"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AdminProjectCard } from "@/components/admin-project-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, ArrowLeft, Sparkles, LogOut, User } from "lucide-react"
import Link from "next/link"
import { getProjectsByUser } from "@/lib/projects-db"
import {
  deleteProject as deleteProjectDb,
} from "@/lib/projects-actions"
import { getCurrentUser, signOut } from "@/lib/auth-db"
import type { Project } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)
      const userProjects = await getProjectsByUser(currentUser.userId)
      setProjects(userProjects)
      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const handleDeleteProject = async () => {
    if (deletingProject) {
      const result = await deleteProjectDb(deletingProject.id)
      if (result.success) {
        const userProjects = await getProjectsByUser(user.userId)
        setProjects(userProjects)
        setDeletingProject(null)
      }
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Portfolio</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Portfolio Manager</h1>
                <p className="text-xs text-muted-foreground">Welcome, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button asChild className="flex-1 sm:flex-none">
                <Link href="/admin/new">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Project</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">All Projects</h2>
              <p className="text-sm text-muted-foreground">
                {projects.length} {projects.length === 1 ? "project" : "projects"} total
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" asChild className="flex-1 sm:flex-none bg-transparent">
                <Link href="/admin/profile">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 sm:flex-none bg-transparent">
                <Link href="/admin/ai-assistant">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assistant
                </Link>
              </Button>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No projects yet. Create your first one!</p>
              <Button asChild>
                <Link href="/admin/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <AdminProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => router.push(`/admin/edit/${project.id}`)}
                  onDelete={() => setDeletingProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingProject?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
