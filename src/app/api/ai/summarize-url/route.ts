import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { JSDOM } from "jsdom";

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
    const dom = new JSDOM(html);
    const mainContent = (dom.window.document.body.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 10000); // Limit content length

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `다음 텍스트를 요약해주세요:

${mainContent}

요약:`,
    });

    return Response.json({ summary: text });
  } catch (error) {
    console.error("Error summarizing url:", error);
    return Response.json({ error: "Failed to summarize url" }, { status: 500 });
  }
}