import type { Project, ProjectFormData } from "./types"
import { mockProjects } from "./mock-data"

const STORAGE_KEY = "portfolio_projects"

export function getProjects(): Project[] {
  if (typeof window === "undefined") return mockProjects

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects))
    return mockProjects
  }
  return JSON.parse(stored)
}

export function saveProject(data: ProjectFormData): Project {
  const projects = getProjects()
  const newProject: Project = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString().split("T")[0],
  }

  const updated = [...projects, newProject]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return newProject
}

export function updateProject(id: string, data: Partial<ProjectFormData>): Project {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === id)

  if (index === -1) throw new Error("Project not found")

  const updated = [...projects]
  updated[index] = { ...updated[index], ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated[index]
}

export function deleteProject(id: string): void {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}
