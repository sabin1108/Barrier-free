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

export async function requestSignupOtp(email: string) {
  try {
    // 가입하려는 이메일이 이미 데이터베이스에 등록되어 있는지 검증합니다.
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "이미 가입된 이메일입니다." }
    }

    // 6자리의 임의 인증 코드(OTP)를 무작위로 생성합니다.
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 메일 전송 모듈이 연결되기 전이므로, 검증 및 모니터링을 위해 백엔드 콘솔에 출력합니다.
    console.log(`[OTP GENERATION] Email: ${email}, OTP: ${otpCode}`)

    // 보안을 위해 OTP 원본 대신 salt와 해시(sha256) 결과물을 조합해 검증용 정보로 저장합니다.
    const salt = randomBytes(16).toString("base64url")
    const hash = pbkdf2Sync(otpCode, salt, 10000, 32, "sha256").toString("base64url")
    const expiresAt = Date.now() + 5 * 60 * 1000 // 유효 기간은 5분으로 설정합니다.

    // 사용자의 인증 상태 세션을 유지하기 위해 쿠키에 OTP 검증에 필요한 메타데이터를 저장합니다.
    const cookieStore = await cookies()
    cookieStore.set(
      "signup_otp",
      JSON.stringify({
        email,
        hash,
        salt,
        expiresAt,
      }),
      {
        httpOnly: true, // 클라이언트 자바스크립트에서 접근할 수 없도록 하여 XSS 공격을 예방합니다.
        secure: false, // 로컬 개발 테스트를 위해 HTTPS 제한을 임시 해제합니다.
        sameSite: "lax",
        maxAge: 60 * 5, // 쿠키도 5분 뒤 자동 소멸되도록 합니다.
      }
    )

    // 개발 환경에서는 사용자가 별도의 로그 확인 없이 간편히 인증할 수 있도록 응답에 코드를 실어 반환합니다.
    return { 
      success: true, 
      otp: process.env.NODE_ENV === "development" ? otpCode : undefined 
    }
  } catch (error) {
    console.error("OTP generation error:", error)
    return { success: false, error: "OTP 생성에 실패했습니다." }
  }
}

export async function signUp(email: string, password: string, name: string, otpCode: string) {
  try {
    const cookieStore = await cookies()
    const otpCookie = cookieStore.get("signup_otp")

    // 인증 유효시간 만료 등으로 쿠키가 없는 경우 다시 OTP를 요청하도록 가이드합니다.
    if (!otpCookie) {
      return { success: false, error: "인증 세션이 만료되었습니다. 다시 OTP를 요청하세요." }
    }

    const { email: otpEmail, hash: storedHash, salt: storedSalt, expiresAt } = JSON.parse(otpCookie.value)

    // 입력된 이메일과 OTP 세션 내 이메일이 다르면 부정 승인 방지를 위해 차단합니다.
    if (otpEmail !== email) {
      return { success: false, error: "이메일 주소가 올바르지 않습니다." }
    }

    // 5분 유효 시간이 경과되었는지 서버 시간 기준으로 교차 체크합니다.
    if (Date.now() > expiresAt) {
      return { success: false, error: "인증 시간이 초과되었습니다. OTP를 재발송하세요." }
    }

    // 사용자가 입력한 인증 번호를 기존 salt와 함께 동일한 방식으로 해싱하여 비교합니다.
    const expectedHash = pbkdf2Sync(otpCode, storedSalt, 10000, 32, "sha256").toString("base64url")
    if (expectedHash !== storedHash) {
      return { success: false, error: "인증번호가 일치하지 않습니다." }
    }

    // 최종 가입 승인 단계 직전, 중복 이메일 가입이 동시성 이슈로 진행되었는지 최종 재확인합니다.
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" }
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const passwordHash = hashPassword(password)

    // 최종 검증 완료된 사용자 레코드를 데이터베이스에 저장합니다.
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

    // 인증 성공 후 사용 완료된 OTP 인증용 임시 쿠키는 즉시 파기합니다.
    cookieStore.delete("signup_otp")

    // 신규 회원의 세션 상태를 유지하기 위해 메인 로그인 쿠키를 발급합니다.
    cookieStore.set("user_session", JSON.stringify({ userId, email, name }), {
      httpOnly: true,
      secure: false, // 로컬 환경 및 비 HTTPS 테스트 환경을 고려하여 비활성화합니다.
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12시간 동안 로그인을 유지합니다.
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
