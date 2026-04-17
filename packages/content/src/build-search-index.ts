import { buildCatalog, type CatalogEntry } from "./build-catalog";

export interface SearchIndexEntry {
  id: string;
  title: string;
  type: "work" | "author" | "collection";
  href: string;
}

export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const catalog = await buildCatalog();
  return catalog.map((entry) => ({
    id: entry.id,
    title: entry.title,
    type: entry.type,
    href: entry.href,
  }));
}