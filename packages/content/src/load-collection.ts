import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { collectionSchema, type Collection } from "./schema";

const LIBRARY_ROOT = process.env.LIBRARY_PATH || process.cwd();

export async function loadCollection(slug: string): Promise<Collection> {
  const filePath = path.join(LIBRARY_ROOT, "collections", `${slug}.md`);
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  return collectionSchema.parse(parsed.data);
}