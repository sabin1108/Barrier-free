"use server"

import { sql } from "./db"
import type { DBProject, Project } from "./types"
import { getCurrentUser } from "./auth-db"
import { revalidatePath } from "next/cache"
import { verifyTechStacks } from "./tech-stack-verifier"

export async function createProject(data: Omit<DBProject, "id" | "created_at" | "updated_at" | "user_id">) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const validTags = await verifyTechStacks(data.tags || [])

    await sql`
      INSERT INTO projects (
        id, title, description, image_url, github_url, live_url, tags, featured, user_id
      ) VALUES (
        ${projectId},
        ${data.title},
        ${data.description},
        ${data.image_url || null},
        ${data.github_url || null},
        ${data.live_url || null},
        ${validTags},
        ${data.featured},
        ${user.userId}
      )
    `

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, id: projectId }
  } catch (error) {
    console.error("Create project error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(
  id: string,
  data: Partial<Omit<DBProject, "id" | "created_at" | "updated_at" | "user_id">>,
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check ownership
    const existing = await sql`
      SELECT user_id FROM projects WHERE id = ${id}
    `

    if (existing.length === 0 || existing[0].user_id !== user.userId) {
      return { success: false, error: "Not authorized" }
    }

    const updates: string[] = []
    const values: any[] = []

    const addUpdate = (field: string, value: any) => {
      updates.push(`${field} = $${values.length + 1}`)
      values.push(value)
    }

    if (data.title !== undefined) addUpdate("title", data.title)
    if (data.description !== undefined) addUpdate("description", data.description)
    if (data.image_url !== undefined) addUpdate("image_url", data.image_url || null)
    if (data.github_url !== undefined) addUpdate("github_url", data.github_url || null)
    if (data.live_url !== undefined) addUpdate("live_url", data.live_url || null)
    if (data.tags !== undefined) {
      const validTags = await verifyTechStacks(data.tags || [])
      addUpdate("tags", validTags)
    }
    if (data.featured !== undefined) addUpdate("featured", data.featured)

    if (updates.length > 0) {
      const queryString = `UPDATE projects SET ${updates.join(
        ", ",
      )} WHERE id = $${values.length + 1}`
      values.push(id)
      await sql.query(queryString, values)
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Update project error:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check ownership
    const existing = await sql`
      SELECT user_id FROM projects WHERE id = ${id}
    `

    if (existing.length === 0 || existing[0].user_id !== user.userId) {
      return { success: false, error: "Not authorized" }
    }

    await sql`
      DELETE FROM projects WHERE id = ${id}
    `

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return null
    }

    const projects = (await sql`
      SELECT * FROM projects WHERE id = ${id}
    `) as DBProject[]

    if (projects.length === 0) {
      return null
    }

    const dbProject = projects[0]

    // Check ownership
    if (dbProject.user_id !== user.userId) {
      return null
    }

    // Map DBProject to Project (frontend type)
    return {
      id: dbProject.id,
      title: dbProject.title,
      description: dbProject.description,
      imageUrl: dbProject.image_url || "",
      githubUrl: dbProject.github_url || undefined,
      liveUrl: dbProject.live_url || undefined,
      tags: dbProject.tags,
      featured: dbProject.featured,
      createdAt: dbProject.created_at.toISOString(),
    }
  } catch (error) {
    console.error("Get project error:", error)
    return null
  }
}
