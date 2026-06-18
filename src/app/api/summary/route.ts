import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { parseHtmlContent } from "@/lib/html-parser";

const openai = createOpenAI({
  apiKey: process.env.PUBLIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();
    const mainContent = parseHtmlContent(html);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: `다음 텍스트를 요약해주세요:

${mainContent}

요약:`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in api/summary:", error);
    return Response.json({ error: "Failed to summarize url" }, { status: 500 });
  }
}
