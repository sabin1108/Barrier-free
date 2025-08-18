import { generateText } from "ai";
import { JSDOM } from "jsdom";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const reader = new dom.window.DOMParser();
    const doc = reader.parseFromString(dom.window.document.body.textContent || "", "text/html");
    const mainContent = doc.body.textContent || "";


    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `다음 텍스트를 요약해주세요:

${mainContent}

요약:`,
    });

    return Response.json({ summary: text });
  } catch (error) {
    console.error("[v0] Error summarizing url:", error);
    return Response.json({ error: "Failed to summarize url" }, { status: 500 });
  }
}