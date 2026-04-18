import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  workHasText,
  loadChapters,
  loadChapter,
} from "./load-chapters";

const tmp = mkdtempSync(path.join(tmpdir(), "cv-chapters-"));

beforeAll(() => {
  const textDir = path.join(tmp, "works", "the-iliad", "text");
  mkdirSync(textDir, { recursive: true });
  writeFileSync(
    path.join(textDir, "01-book-1.md"),
    `---
id: text.the-iliad.book-1
work: work.the-iliad
book: 1
title: Book I - The Rage of Achilles
language: grc
---

# Book I
Line one.
`,
  );
  writeFileSync(
    path.join(textDir, "02-book-2.md"),
    `---
id: text.the-iliad.book-2
work: work.the-iliad
book: 2
title: Book II - The Catalogue
language: grc
---

# Book II
Line two.
`,
  );
  mkdirSync(path.join(tmp, "works", "empty-work"), { recursive: true });
  process.env.LIBRARY_PATH = tmp;
});

afterAll(() => {
  delete process.env.LIBRARY_PATH;
  rmSync(tmp, { recursive: true, force: true });
});

describe("workHasText", () => {
  it("returns true when text markdown files exist", async () => {
    expect(await workHasText("the-iliad")).toBe(true);
  });

  it("returns false when the work has no text directory", async () => {
    expect(await workHasText("empty-work")).toBe(false);
  });

  it("returns false for a missing work", async () => {
    expect(await workHasText("nonexistent")).toBe(false);
  });
});

describe("loadChapters", () => {
  it("returns chapters ordered by filename prefix with derived slugs", async () => {
    const chapters = await loadChapters("the-iliad");
    expect(chapters).toEqual([
      { chapterSlug: "book-1", title: "Book I - The Rage of Achilles", file: "01-book-1.md" },
      { chapterSlug: "book-2", title: "Book II - The Catalogue", file: "02-book-2.md" },
    ]);
  });
});

describe("loadChapter", () => {
  it("returns frontmatter and body for a chapter slug", async () => {
    const chapter = await loadChapter("the-iliad", "book-1");
    expect(chapter.frontmatter.title).toBe("Book I - The Rage of Achilles");
    expect(chapter.body).toContain("Line one.");
  });
});
