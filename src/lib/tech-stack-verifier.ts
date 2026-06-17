import { sql } from "./db"

export async function verifyTechStacks(rawTags: string[]): Promise<string[]> {
  if (!rawTags || rawTags.length === 0) return []

  try {
    const result = await sql`SELECT name, aliases FROM tech_stacks`
    
    const validTags = new Set<string>()
    const aliasMap = new Map<string, string>()

    for (const row of result) {
      const stdName = row.name
      aliasMap.set(stdName.toLowerCase(), stdName)
      
      if (Array.isArray(row.aliases)) {
        for (const alias of row.aliases) {
          aliasMap.set(alias.toLowerCase(), stdName)
        }
      }
    }

    for (const tag of rawTags) {
      const lowerTag = tag.trim().toLowerCase()
      if (aliasMap.has(lowerTag)) {
        validTags.add(aliasMap.get(lowerTag)!)
      }
    }

    return Array.from(validTags)
  } catch (error) {
    console.error("Error verifying tech stacks:", error)
    // In case of DB failure, return empty array or fail?
    // Filtering out unverified is safer.
    return []
  }
}
