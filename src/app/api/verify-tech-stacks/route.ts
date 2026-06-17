import { NextResponse } from "next/server"
import { verifyTechStacks } from "@/lib/tech-stack-verifier"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tags } = body

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ error: "Invalid tags format" }, { status: 400 })
    }

    const verifiedTags = await verifyTechStacks(tags)

    return NextResponse.json({ tags: verifiedTags })
  } catch (error) {
    console.error("Error in api/verify-tech-stacks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
