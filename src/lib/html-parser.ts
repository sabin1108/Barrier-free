import { JSDOM } from "jsdom";

export function parseHtmlContent(html: string, maxLength: number = 10000): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const unwantedTags = document.querySelectorAll("script, style, noscript, iframe");
  unwantedTags.forEach((node) => node.remove());

  const textContent = document.body ? document.body.textContent : document.textContent;
  const mainContent = (textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return mainContent;
}
