import { sql } from "./db"
import type { Project, DBProject } from "./types"

function mapProject(row: DBProject): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url || "",
    githubUrl: row.github_url || undefined,
    liveUrl: row.live_url || undefined,
    tags: row.tags,
    featured: row.featured,
    createdAt: new Date(row.created_at).toLocaleDateString(),
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    if (!sql) {
      console.error("Database connection (sql) is null. Check environment variables.")
      return []
    }

    const projects = await sql`
      SELECT * FROM projects
      ORDER BY featured DESC, created_at DESC
    `
    return (projects as DBProject[]).map(mapProject)
  } catch (error) {
    console.error("Get projects error:", error)
    return []
  }
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  try {
    if (!sql) {
      console.error("Database connection (sql) is null.")
      return []
    }

    const projects = await sql`
      SELECT * FROM projects
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return (projects as DBProject[]).map(mapProject)
  } catch (error) {
    console.error("Get user projects error:", error)
    return []
  }
}