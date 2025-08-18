// drizzle.config.js (최종 수정)

// 🚨 dotenv를 수동으로 require하여 환경 변수를 로드합니다.
require('dotenv').config({ path: './.env.local' }); // .env.local 파일 경로 지정

import { defineConfig } from 'drizzle-kit';

if (!process.env.NEXT_PUBLIC_NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is missing in environment.');
}

export default defineConfig({
  schema: "./lib/schema.ts", 
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_NEON_DATABASE_URL,
  },
});