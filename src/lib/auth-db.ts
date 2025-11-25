"use server"

import { sql } from "./db"
import { cookies } from "next/headers"

export async function signUp(email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" }
    }

    // Create user (in production, hash the password!)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO users(id, email, name, raw_json, created_at, updated_at, password)
      VALUES (
        ${userId},
        ${email},
        ${name},
        ${JSON.stringify({ password })}::jsonb,
        NOW(),
        NOW(),
        ${password}
      )
    `

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify({ userId, email, name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const users = await sql`
      SELECT id, email, name, raw_json
      FROM users
      WHERE email = ${email} AND deleted_at IS NULL
    `

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users[0]
    const storedPassword = (user.raw_json as any)?.password

    // In production, use proper password hashing!
    if (storedPassword !== password) {
      return { success: false, error: "Invalid credentials" }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "user_session",
      JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 12, // 12 hours
      },
    )

    return { success: true }
  } catch (error) {
    console.error("Signin error:", error)
    return { success: false, error: "Failed to sign in" }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
  return { success: true }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("user_session")

    if (!sessionCookie) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)
    return session
  } catch (error) {
    return null
  }
}
