import { neon } from "@neondatabase/serverless";

// 1. NEON_DATABASE_URL 변수를 가져옵니다.
if (!process.env.NEXT_PUBLIC_NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not defined. Please check your .env.local file.");
}
 
// 2. DB_URL을 사용하여 neon 객체를 생성합니다.
export const sql = neon(process.env.NEXT_PUBLIC_NEON_DATABASE_URL);

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  tags: string[];
  featured: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  created_at: Date;
};
