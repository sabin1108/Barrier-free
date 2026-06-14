"use server"

import { sql } from "./db"
import { cookies } from "next/headers"
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto"

const PASSWORD_HASH_PREFIX = "pbkdf2"
const PASSWORD_ITERATIONS = 210000
const PASSWORD_KEY_LENGTH = 32
const PASSWORD_DIGEST = "sha256"

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url")
  const hash = pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString("base64url")
  return `${PASSWORD_HASH_PREFIX}$${PASSWORD_ITERATIONS}$${salt}$${hash}`
}

function verifyPassword(password: string, stored: string | null | undefined) {
  if (!stored) return false

  const [prefix, iterationsText, salt, hash] = stored.split("$")
  if (prefix !== PASSWORD_HASH_PREFIX || !iterationsText || !salt || !hash) {
    return stored === password
  }

  const iterations = Number(iterationsText)
  if (!Number.isInteger(iterations) || iterations <= 0) return false

  const expected = Buffer.from(hash, "base64url")
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, PASSWORD_DIGEST)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function signUp(email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" }
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const passwordHash = hashPassword(password)

    await sql`
      INSERT INTO users(id, email, name, raw_json, created_at, updated_at, password)
      VALUES (
        ${userId},
        ${email},
        ${name},
        ${JSON.stringify({})}::jsonb,
        NOW(),
        NOW(),
        ${passwordHash}
      )
    `

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify({ userId, email, name }), {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === "production", // Disabled for non-HTTPS deployment
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
      SELECT id, email, name, raw_json, password
      FROM users
      WHERE email = ${email} AND deleted_at IS NULL
    `

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users[0]
    const storedPassword = user.password ?? (user.raw_json as any)?.password

    if (!verifyPassword(password, storedPassword)) {
      return { success: false, error: "Invalid credentials" }
    }

    if (storedPassword === password) {
      await sql`
        UPDATE users
        SET password = ${hashPassword(password)}, raw_json = COALESCE(raw_json, '{}'::jsonb) - 'password', updated_at = NOW()
        WHERE id = ${user.id}
      `
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
        secure: false, // process.env.NODE_ENV === "production", // Disabled for non-HTTPS deployment
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
