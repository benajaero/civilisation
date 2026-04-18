import { MetadataRoute } from "next";
import { loadRooms } from "@civilisation/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://civilisation-web.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await loadRooms();

  // Collect all work slugs from room entries
  const workSlugs = new Set<string>();
  for (const room of rooms) {
    for (const entry of room.entries) {
      if (entry.slug) workSlugs.add(entry.slug);
    }
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const roomRoutes: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${SITE_URL}/rooms/${room.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const workRoutes: MetadataRoute.Sitemap = Array.from(workSlugs).map((slug) => ({
    url: `${SITE_URL}/works/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...roomRoutes, ...workRoutes];
}