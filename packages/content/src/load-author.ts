import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { authorSchema, type Author } from "./schema";

const LIBRARY_ROOT = process.env.LIBRARY_PATH || process.cwd();

export async function loadAuthor(slug: string): Promise<Author> {
  const filePath = path.join(LIBRARY_ROOT, "authors", `${slug}.md`);
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  return authorSchema.parse(parsed.data);
}