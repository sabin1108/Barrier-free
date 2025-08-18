import { sql, type Project } from "./db"

export async function getProjects(): Promise<Project[]> {
  try {
    // 💡 1. sql이 null인지 확인합니다.
    if (!sql) {
      console.error("Database connection (sql) is null. Check environment variables.")
      return [] // DB 연결 실패 시 빈 배열 반환
    }
      
    // 💡 2. sql이 null이 아닐 경우에만 호출합니다.
    const projects = await sql`
      SELECT * FROM projects
      ORDER BY featured DESC, created_at DESC
    `
    return projects as Project[]
  } catch (error) {
    console.error("Get projects error:", error)
    return []
  }
}

// getProjectsByUser도 같은 방식으로 수정해야 합니다.
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
    return projects as Project[]
  } catch (error) {
    console.error("Get user projects error:", error)
    return []
  }
}