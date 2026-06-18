import { describe, it, expect } from "vitest";
import { parseHtmlContent } from "./html-parser";

describe("parseHtmlContent", () => {
  it("should remove script and style tags completely", () => {
    const html = `
      <html>
        <head>
          <style>.hidden { display: none; }</style>
        </head>
        <body>
          <h1>Hello World</h1>
          <script>console.log("This is a script");</script>
          <p>This is a test paragraph.</p>
        </body>
      </html>
    `;
    
    const result = parseHtmlContent(html);
    
    expect(result).not.toContain(".hidden { display: none; }");
    expect(result).not.toContain("This is a script");
    expect(result).toContain("Hello World");
    expect(result).toContain("This is a test paragraph.");
  });

  it("should truncate content to maxLength", () => {
    const longText = "A".repeat(15000);
    const html = `<html><body><p>${longText}</p></body></html>`;
    
    const result = parseHtmlContent(html, 10000);
    
    expect(result.length).toBe(10000);
  });
});
