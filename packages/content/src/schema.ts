import { z } from "zod";

export const workSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  authors: z.array(z.string()).min(1),
  countries: z.array(z.string()).min(1),
  language: z.string(),
  available_languages: z.array(z.string()).min(1),
  civilisations: z.array(z.string()).min(1),
  rights: z.object({
    status: z.string(),
    basis: z.string(),
  }),
  links: z.object({
    related_works: z.array(z.string()).default([]),
    related_authors: z.array(z.string()).default([]),
    collections: z.array(z.string()).default([]),
  }),
  review: z.object({
    status: z.enum(["draft", "submitted", "under_review", "approved", "published"]),
    approved_by: z.array(z.string()).default([]),
  }),
});

export type Work = z.infer<typeof workSchema>;

export const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  countries: z.array(z.string()),
  civilisations: z.array(z.string()),
  languages: z.array(z.string()),
  dates: z.record(z.string()).optional(),
});

export type Author = z.infer<typeof authorSchema>;

export const collectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  countries: z.array(z.string()),
  civilisations: z.array(z.string()),
});

export type Collection = z.infer<typeof collectionSchema>;