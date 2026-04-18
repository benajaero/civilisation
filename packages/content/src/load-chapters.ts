import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const LIBRARY_ROOT = () => process.env.LIBRARY_PATH || process.cwd();

const chapterFrontmatterSchema = z.object({
  id: z.string(),
  work: z.string(),
  book: z.number().int().optional(),
  title: z.string(),
  language: z.string(),
});

export type ChapterFrontmatter = z.infer<typeof chapterFrontmatterSchema>;

export interface ChapterSummary {
  chapterSlug: string;
  title: string;
  file: string;
}

const textDir = (slug: string) => path.join(LIBRARY_ROOT(), "works", slug, "text");

const deriveSlug = (filename: string): string =>
  filename.replace(/^\d+-/, "").replace(/\.md$/, "");

export async function workHasText(slug: string): Promise<boolean> {
  try {
    const s = await stat(textDir(slug));
    if (!s.isDirectory()) return false;
    const files = await readdir(textDir(slug));
    return files.some((f) => f.endsWith(".md"));
  } catch {
    return false;
  }
}

export async function loadChapters(slug: string): Promise<ChapterSummary[]> {
  const files = (await readdir(textDir(slug)))
    .filter((f) => f.endsWith(".md"))
    .sort();

  const summaries = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(textDir(slug), file), "utf8");
      const { data } = matter(source);
      const fm = chapterFrontmatterSchema.parse(data);
      return {
        chapterSlug: deriveSlug(file),
        title: fm.title,
        file,
      };
    }),
  );

  return summaries;
}

export async function loadChapter(
  slug: string,
  chapterSlug: string,
): Promise<{ frontmatter: ChapterFrontmatter; body: string }> {
  const files = (await readdir(textDir(slug))).filter((f) => f.endsWith(".md"));
  const file = files.find((f) => deriveSlug(f) === chapterSlug);
  if (!file) {
    throw new Error(`chapter not found: ${slug}/${chapterSlug}`);
  }
  const source = await readFile(path.join(textDir(slug), file), "utf8");
  const parsed = matter(source);
  return {
    frontmatter: chapterFrontmatterSchema.parse(parsed.data),
    body: parsed.content,
  };
}
