import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface CatalogEntry {
  id: string;
  title: string;
  type: "work" | "author" | "collection";
  href: string;
}

export async function buildCatalog(): Promise<CatalogEntry[]> {
  const catalog: CatalogEntry[] = [];

  // Load works
  const worksDir = path.join(process.cwd(), "library", "works");
  try {
    const workDirs = await readdir(worksDir);
    for (const dir of workDirs) {
      const workPath = path.join(worksDir, dir, "work.md");
      try {
        const source = await readFile(workPath, "utf8");
        const { data } = matter(source);
        catalog.push({
          id: data.id,
          title: data.title,
          type: "work",
          href: `/works/${data.slug || dir}`,
        });
      } catch {}
    }
  } catch {}

  // Load authors
  const authorsDir = path.join(process.cwd(), "library", "authors");
  try {
    const authorFiles = await readdir(authorsDir);
    for (const file of authorFiles) {
      if (!file.endsWith(".md")) continue;
      const authorPath = path.join(authorsDir, file);
      try {
        const source = await readFile(authorPath, "utf8");
        const { data } = matter(source);
        const slug = file.replace(".md", "");
        catalog.push({
          id: data.id,
          title: data.name,
          type: "author",
          href: `/authors/${slug}`,
        });
      } catch {}
    }
  } catch {}

  // Load collections
  const collectionsDir = path.join(process.cwd(), "library", "collections");
  try {
    const collectionFiles = await readdir(collectionsDir);
    for (const file of collectionFiles) {
      if (!file.endsWith(".md")) continue;
      const collectionPath = path.join(collectionsDir, file);
      try {
        const source = await readFile(collectionPath, "utf8");
        const { data } = matter(source);
        const slug = file.replace(".md", "");
        catalog.push({
          id: data.id,
          title: data.title,
          type: "collection",
          href: `/collections/${slug}`,
        });
      } catch {}
    }
  } catch {}

  return catalog;
}