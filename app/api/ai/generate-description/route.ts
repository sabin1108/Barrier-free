import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { title, tags, existingDescription } = await request.json()

    if (!title) {
      return Response.json({ error: "Title is required" }, { status: 400 })
    }

    const tagsText = tags && tags.length > 0 ? `사용된 기술: ${tags.join(", ")}` : ""
    const existingText = existingDescription ? `\n\n현재 설명: ${existingDescription}` : ""

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `프로젝트 제목: ${title}
${tagsText}${existingText}

이 프로젝트를 위한 전문적이고 매력적인 포트폴리오 설명을 작성해주세요. 
- 2-3문장으로 간결하게 작성
- 프로젝트의 목적과 주요 기능 강조
- 기술적 특징이나 혁신적인 부분 언급
- 한국어로 작성

설명:`,
    })

    return Response.json({ description: text })
  } catch (error) {
    console.error("[v0] Error generating description:", error)
    return Response.json({ error: "Failed to generate description" }, { status: 500 })
  }
}
