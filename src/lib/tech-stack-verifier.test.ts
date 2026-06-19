import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyTechStacks } from "./tech-stack-verifier";
import { sql } from "./db";

vi.mock("./db", () => {
  return {
    sql: vi.fn()
  };
});

describe("verifyTechStacks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should replace aliases with standard names", async () => {
    (sql as any).mockResolvedValue([
      { name: "JavaScript", aliases: ["js", "es6"] },
      { name: "TypeScript", aliases: ["ts"] }
    ]);

    const result = await verifyTechStacks(["JS", "ts"]);
    
    expect(result).toContain("JavaScript");
    expect(result).toContain("TypeScript");
    expect(result).not.toContain("JS");
    expect(result).not.toContain("ts");
  });

  it("should filter out unknown or typoed tags", async () => {
    (sql as any).mockResolvedValue([
      { name: "JavaScript", aliases: ["js"] }
    ]);

    const result = await verifyTechStacks(["JS", "JavaScrpt", "FakeTech"]);
    
    expect(result).toEqual(["JavaScript"]);
  });
});
