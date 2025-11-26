"use server"

import { sql } from "./db"
import type { DBProfile, Profile } from "./types"
import { getCurrentUser } from "./auth-db"
import { revalidatePath } from "next/cache"

export async function ensureProfileTable() {
    await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      headline TEXT NOT NULL,
      bio TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `
}

export async function getProfile(): Promise<Profile | null> {
    try {
        // Ensure table exists (lazy initialization)
        await ensureProfileTable()

        const user = await getCurrentUser()
        let userId = user?.userId

        if (!userId) {
            const profiles = (await sql`SELECT * FROM profiles LIMIT 1`) as DBProfile[]
            if (profiles.length > 0) {
                const p = profiles[0]
                return {
                    id: p.id,
                    headline: p.headline,
                    bio: p.bio
                }
            }
            return null
        }

        const profiles = (await sql`
      SELECT * FROM profiles WHERE user_id = ${userId}
    `) as DBProfile[]

        if (profiles.length === 0) {
            return null
        }

        const p = profiles[0]
        return {
            id: p.id,
            headline: p.headline,
            bio: p.bio,
        }
    } catch (error) {
        console.error("Get profile error:", error)
        return null
    }
}

export async function updateProfile(data: { headline: string; bio: string }) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: "Not authenticated" }
        }

        await ensureProfileTable()

        const existing = (await sql`
      SELECT * FROM profiles WHERE user_id = ${user.userId}
    `) as DBProfile[]

        if (existing.length === 0) {
            // Create new
            const id = `prof_${Date.now()}`
            await sql`
        INSERT INTO profiles (id, user_id, headline, bio)
        VALUES (${id}, ${user.userId}, ${data.headline}, ${data.bio})
      `
        } else {
            // Update existing
            await sql`
        UPDATE profiles
        SET headline = ${data.headline}, bio = ${data.bio}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user.userId}
      `
        }

        revalidatePath("/")
        revalidatePath("/admin/profile")

        return { success: true }
    } catch (error) {
        console.error("Update profile error:", error)
        return { success: false, error: "Failed to update profile" }
    }
}
