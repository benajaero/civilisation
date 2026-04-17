type LinkGroups = {
  related_works: string[];
  related_authors: string[];
  collections: string[];
};

function idToPath(id: string): string {
  const [kind, slug] = id.split(".");
  if (kind === "work") return `/works/${slug}`;
  if (kind === "author") return `/authors/${slug}`;
  return `/collections/${slug}`;
}

export function resolveLinks(groups: LinkGroups) {
  return {
    related_works: groups.related_works.map((id) => ({ id, href: idToPath(id) })),
    related_authors: groups.related_authors.map((id) => ({ id, href: idToPath(id) })),
    collections: groups.collections.map((id) => ({ id, href: idToPath(id) })),
  };
}