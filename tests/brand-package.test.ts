import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { colorTokens, spacingTokens, typographyTokens } from "../packages/brand/src/tokens";

describe("brand package", () => {
  it("defines launch tokens for austere editorial surfaces", () => {
    expect(colorTokens.canvas).toBe("#f4f0e8");
    expect(colorTokens.ink).toBe("#161412");
    expect(spacingTokens["layout-gutter"]).toBe("clamp(1.25rem, 2vw, 2rem)");
    expect(typographyTokens.display.family).toContain("Fraunces");
  });

  it("ships written principles for launch usage", () => {
    expect(existsSync("packages/brand/docs/principles.md")).toBe(true);
    expect(readFileSync("packages/brand/docs/principles.md", "utf8")).toContain(
      "austere, archival, editorial, and minimalist",
    );
  });
});
