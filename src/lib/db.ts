import { neon } from "@neondatabase/serverless";

// 1. NEON_DATABASE_URL 변수를 가져옵니다.
if (!process.env.NEXT_PUBLIC_NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not defined. Please check your .env.local file.");
}

// 2. DB_URL을 사용하여 neon 객체를 생성합니다.
export const sql = neon(process.env.NEXT_PUBLIC_NEON_DATABASE_URL);

// Types are now imported from ./types.ts
