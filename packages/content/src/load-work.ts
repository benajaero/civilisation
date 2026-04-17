import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { workSchema, type Work } from "./schema";

const LIBRARY_ROOT = process.env.LIBRARY_PATH || process.cwd();

export async function loadWork(slug: string): Promise<Work> {
  const filePath = path.join(LIBRARY_ROOT, "works", slug, "work.md");
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  return workSchema.parse(parsed.data);
}