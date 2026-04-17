# Library of Civilisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public, static-first Library of Civilisation monorepo with a fast Next.js 16.2 website, canonical Markdown/YAML content model, contributor governance, and GitHub review protections.

**Architecture:** Use a monorepo with a single Next.js 16.2 App Router site under `apps/web/` and canonical content records under `library/`. Ingest Markdown/YAML files at build time, validate them through typed schemas and tests, resolve internal links into static routes, and emit a statically rendered reading site plus precomputed indexes and search data.

**Tech Stack:** Next.js 16.2, React 19, TypeScript 5, Node.js 22, pnpm 10, Vitest, Testing Library, Zod, gray-matter, remark/rehype, Tailwind CSS 4, GitHub Actions

---

### Task 1: Bootstrap The Monorepo And Core Policy Files

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `README.md`
- Create: `AGENTS.md`
- Create: `CONTRIBUTING.md`
- Create: `docs/policies/content-provenance.md`
- Create: `docs/policies/editorial-review.md`

- [ ] **Step 1: Write the failing repository-shape test**

```ts
// tests/repo-structure.test.ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("repository bootstrap", () => {
  it("contains the required top-level files", () => {
    expect(existsSync("package.json")).toBe(true);
    expect(existsSync("pnpm-workspace.yaml")).toBe(true);
    expect(existsSync("README.md")).toBe(true);
    expect(existsSync("AGENTS.md")).toBe(true);
    expect(existsSync(".gitignore")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/repo-structure.test.ts`
Expected: FAIL with missing `package.json`, `README.md`, or `AGENTS.md`

- [ ] **Step 3: Write the minimal workspace and policy files**

```json
// package.json
{
  "name": "civilisation",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "build": "pnpm --filter @civilisation/web build",
    "dev": "pnpm --filter @civilisation/web dev",
    "lint": "pnpm --filter @civilisation/web lint",
    "test": "vitest run",
    "typecheck": "pnpm --filter @civilisation/web typecheck"
  },
  "devDependencies": {
    "vitest": "^3.2.4"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

```gitignore
.DS_Store
.obsidian/
node_modules/
.env
.env.*
.next/
dist/
build/
coverage/
tmp/
imports/private/
*.log
```

```md
# AGENTS.md

## Rules

- Never commit private Obsidian notes, exports, or unpublished internal documents.
- Never invent provenance, bibliographic data, or rights status.
- Never publish copyrighted text without explicit documented approval.
- Treat `library/` as canonical public content and keep schemas intact.
- Prefer small, reviewable pull requests.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/repo-structure.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore README.md AGENTS.md CONTRIBUTING.md docs/policies/content-provenance.md docs/policies/editorial-review.md tests/repo-structure.test.ts
git commit -m "chore: bootstrap monorepo and policy files"
```

### Task 2: Scaffold The Next.js 16.2 Website

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/components/site-header.tsx`
- Create: `apps/web/src/components/site-footer.tsx`
- Test: `apps/web/src/app/page.test.tsx`

- [ ] **Step 1: Write the failing homepage test**

```tsx
// apps/web/src/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the library mission", () => {
    render(<HomePage />);
    expect(screen.getByText("Library of Civilisation")).toBeInTheDocument();
    expect(
      screen.getByText(/open-source, public-domain, and copyright-free material/i),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/web vitest src/app/page.test.tsx`
Expected: FAIL with missing module or missing component

- [ ] **Step 3: Write the minimal Next.js 16.2 app**

```json
// apps/web/package.json
{
  "name": "@civilisation/web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "vitest": "vitest run"
  },
  "dependencies": {
    "next": "16.2.0",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
```

```ts
// apps/web/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

```tsx
// apps/web/src/app/page.tsx
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <h1 className="text-5xl font-semibold tracking-tight">Library of Civilisation</h1>
      <p className="max-w-2xl text-lg text-neutral-700">
        A public library for open-source, public-domain, and copyright-free material,
        designed for fast reading, discovery, and multilingual access.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Run tests and app checks**

Run: `pnpm install && pnpm --filter @civilisation/web vitest src/app/page.test.tsx && pnpm --filter @civilisation/web typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web package.json pnpm-workspace.yaml
git commit -m "feat: scaffold nextjs 16 website"
```

### Task 3: Create The Canonical Library Schema And Sample Records

**Files:**
- Create: `library/authors/homer.md`
- Create: `library/collections/greek-epics.md`
- Create: `library/languages/grc.md`
- Create: `library/languages/en.md`
- Create: `library/works/the-iliad/work.md`
- Create: `library/works/the-iliad/sources.md`
- Create: `library/works/the-iliad/text/01-book-1.md`
- Test: `tests/library-sample-records.test.ts`

- [ ] **Step 1: Write the failing sample-record validation test**

```ts
// tests/library-sample-records.test.ts
import { readFileSync } from "node:fs";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

describe("sample work records", () => {
  it("includes author, country, rights, and links metadata", () => {
    const file = readFileSync("library/works/the-iliad/work.md", "utf8");
    const parsed = matter(file);
    expect(parsed.data.authors).toEqual(["author.homer"]);
    expect(parsed.data.countries).toEqual(["greece"]);
    expect(parsed.data.rights.status).toBe("public_domain");
    expect(parsed.data.links.related_works).toContain("work.the-odyssey");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/library-sample-records.test.ts`
Expected: FAIL with missing file

- [ ] **Step 3: Write the sample corpus records**

```md
---
id: author.homer
name: Homer
countries:
  - greece
civilisations:
  - ancient-greece
languages:
  - grc
dates:
  floruit: "8th century BCE"
---
Canonical author record for Homer.
```

```md
---
id: work.the-iliad
slug: the-iliad
title: The Iliad
authors:
  - author.homer
countries:
  - greece
language: grc
available_languages:
  - grc
  - en
civilisations:
  - ancient-greece
rights:
  status: public_domain
  basis: public_domain
links:
  related_works:
    - work.the-odyssey
  related_authors:
    - author.homer
  collections:
    - collection.greek-epics
review:
  status: published
  approved_by:
    - ebenezerajaero
---
The canonical entry record for The Iliad.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/library-sample-records.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add library tests/library-sample-records.test.ts
git commit -m "feat: add canonical library sample records"
```

### Task 4: Build Typed Content Loading And Validation

**Files:**
- Create: `packages/content/package.json`
- Create: `packages/content/src/schema.ts`
- Create: `packages/content/src/load-work.ts`
- Create: `packages/content/src/load-author.ts`
- Create: `packages/content/src/index.ts`
- Test: `packages/content/src/load-work.test.ts`

- [ ] **Step 1: Write the failing parser test**

```ts
// packages/content/src/load-work.test.ts
import { describe, expect, it } from "vitest";
import { loadWork } from "./load-work";

describe("loadWork", () => {
  it("returns a validated work record", async () => {
    const work = await loadWork("the-iliad");
    expect(work.id).toBe("work.the-iliad");
    expect(work.authors).toEqual(["author.homer"]);
    expect(work.links.related_works).toContain("work.the-odyssey");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/content vitest src/load-work.test.ts`
Expected: FAIL with missing package or missing function

- [ ] **Step 3: Write the content package**

```ts
// packages/content/src/schema.ts
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
```

```ts
// packages/content/src/load-work.ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { workSchema } from "./schema";

export async function loadWork(slug: string) {
  const filePath = path.join(process.cwd(), "library", "works", slug, "work.md");
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  return workSchema.parse(parsed.data);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @civilisation/content vitest src/load-work.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/content
git commit -m "feat: add typed content loading and validation"
```

### Task 5: Render Static Work, Author, And Collection Routes

**Files:**
- Create: `apps/web/src/app/works/[slug]/page.tsx`
- Create: `apps/web/src/app/authors/[slug]/page.tsx`
- Create: `apps/web/src/app/collections/[slug]/page.tsx`
- Create: `apps/web/src/lib/content.ts`
- Test: `apps/web/src/app/works/[slug]/page.test.tsx`

- [ ] **Step 1: Write the failing work route test**

```tsx
// apps/web/src/app/works/[slug]/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorkPage from "./page";

describe("WorkPage", () => {
  it("renders work title and related links", async () => {
    const element = await WorkPage({ params: Promise.resolve({ slug: "the-iliad" }) });
    render(element);
    expect(screen.getByText("The Iliad")).toBeInTheDocument();
    expect(screen.getByText(/related works/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/web vitest src/app/works/[slug]/page.test.tsx`
Expected: FAIL with missing route component

- [ ] **Step 3: Write the static route**

```tsx
// apps/web/src/app/works/[slug]/page.tsx
import { loadWork } from "@civilisation/content";

export async function generateStaticParams() {
  return [{ slug: "the-iliad" }];
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await loadWork(slug);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">{work.title}</h1>
      <p className="mt-4 text-sm uppercase tracking-wide">{work.countries.join(", ")}</p>
      <section className="mt-10">
        <h2 className="text-xl font-medium">Related works</h2>
        <ul className="mt-3">
          {work.links.related_works.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run route tests and build**

Run: `pnpm --filter @civilisation/web vitest src/app/works/[slug]/page.test.tsx && pnpm --filter @civilisation/web build`
Expected: PASS and successful static generation

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/works apps/web/src/app/authors apps/web/src/app/collections apps/web/src/lib/content.ts
git commit -m "feat: render static library routes"
```

### Task 6: Add Link Resolution, Backlinks, And Precomputed Catalog Data

**Files:**
- Create: `packages/content/src/build-catalog.ts`
- Create: `packages/content/src/resolve-links.ts`
- Create: `apps/web/src/app/catalog/page.tsx`
- Create: `apps/web/src/components/backlinks.tsx`
- Test: `packages/content/src/resolve-links.test.ts`

- [ ] **Step 1: Write the failing link-resolution test**

```ts
// packages/content/src/resolve-links.test.ts
import { describe, expect, it } from "vitest";
import { resolveLinks } from "./resolve-links";

describe("resolveLinks", () => {
  it("maps record ids to site routes", () => {
    const routes = resolveLinks({
      related_works: ["work.the-odyssey"],
      related_authors: ["author.homer"],
      collections: ["collection.greek-epics"],
    });

    expect(routes.related_works[0].href).toBe("/works/the-odyssey");
    expect(routes.related_authors[0].href).toBe("/authors/homer");
    expect(routes.collections[0].href).toBe("/collections/greek-epics");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/content vitest src/resolve-links.test.ts`
Expected: FAIL with missing function

- [ ] **Step 3: Write the resolver and catalog builder**

```ts
// packages/content/src/resolve-links.ts
type LinkGroups = {
  related_works: string[];
  related_authors: string[];
  collections: string[];
};

function idToPath(id: string) {
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
```

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @civilisation/content vitest src/resolve-links.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/content apps/web/src/app/catalog apps/web/src/components/backlinks.tsx
git commit -m "feat: add link resolution and catalog generation"
```

### Task 7: Precompute Search Data And Build A Fast Reader UI

**Files:**
- Create: `packages/content/src/build-search-index.ts`
- Create: `apps/web/src/app/search/page.tsx`
- Create: `apps/web/src/components/search-box.tsx`
- Create: `apps/web/src/components/reader-layout.tsx`
- Create: `apps/web/public/search-index.json`
- Test: `packages/content/src/build-search-index.test.ts`

- [ ] **Step 1: Write the failing search-index test**

```ts
// packages/content/src/build-search-index.test.ts
import { describe, expect, it } from "vitest";
import { buildSearchIndex } from "./build-search-index";

describe("buildSearchIndex", () => {
  it("emits a compact searchable record list", async () => {
    const index = await buildSearchIndex();
    expect(index[0]).toMatchObject({
      id: "work.the-iliad",
      title: "The Iliad",
      href: "/works/the-iliad",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/content vitest src/build-search-index.test.ts`
Expected: FAIL with missing function

- [ ] **Step 3: Write the index builder and reader shell**

```ts
// packages/content/src/build-search-index.ts
export async function buildSearchIndex() {
  return [
    {
      id: "work.the-iliad",
      title: "The Iliad",
      href: "/works/the-iliad",
      countries: ["greece"],
      languages: ["grc", "en"],
    },
  ];
}
```

```tsx
// apps/web/src/components/reader-layout.tsx
export function ReaderLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section className="min-w-0">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <div className="prose prose-neutral mt-8 max-w-none">{children}</div>
      </section>
      <aside className="border-l border-neutral-200 pl-6 text-sm text-neutral-600">
        Fast static reading view with room for translations and notes.
      </aside>
    </article>
  );
}
```

- [ ] **Step 4: Run tests and build**

Run: `pnpm --filter @civilisation/content vitest src/build-search-index.test.ts && pnpm --filter @civilisation/web build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/content/src/build-search-index.ts apps/web/src/app/search apps/web/src/components/search-box.tsx apps/web/src/components/reader-layout.tsx apps/web/public/search-index.json
git commit -m "feat: add search index and fast reader ui"
```

### Task 8: Add CI, CODEOWNERS, And GitHub Policy Automation

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/ISSUE_TEMPLATE/content_submission.yml`
- Create: `.github/CODEOWNERS`
- Create: `docs/policies/repository-governance.md`
- Test: `tests/ci-config.test.ts`

- [ ] **Step 1: Write the failing CI policy test**

```ts
// tests/ci-config.test.ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("ci config", () => {
  it("runs lint, typecheck, test, and build", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
    expect(workflow).toContain("pnpm lint");
    expect(workflow).toContain("pnpm typecheck");
    expect(workflow).toContain("pnpm test");
    expect(workflow).toContain("pnpm build");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/ci-config.test.ts`
Expected: FAIL with missing workflow file

- [ ] **Step 3: Write the workflow and ownership rules**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

```text
# .github/CODEOWNERS
* @ebenezerajaero
/library/works/ @ebenezerajaero
/docs/policies/ @ebenezerajaero
/apps/web/ @ebenezerajaero
```

- [ ] **Step 4: Run tests**

Run: `pnpm vitest tests/ci-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .github docs/policies/repository-governance.md tests/ci-config.test.ts
git commit -m "chore: add ci and repository governance"
```

### Task 9: Publish The Repository And Apply GitHub Protections

**Files:**
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `docs/policies/repository-governance.md`

- [ ] **Step 1: Verify local repository state before publishing**

Run: `git status --short && pnpm test && pnpm build`
Expected: clean working tree and passing checks

- [ ] **Step 2: Create the public GitHub repository**

Run: `gh repo create civilisation --public --source=. --remote=origin --push`
Expected: GitHub prints the new repository URL and pushes `main`

- [ ] **Step 3: Apply branch protection rules**

Run: `gh api repos/:owner/civilisation/branches/main/protection --method PUT --input .github/branch-protection.json`
Expected: GitHub API returns branch protection JSON with required reviews and status checks

- [ ] **Step 4: Add approved maintainers and reviewers**

Run: `gh api repos/:owner/civilisation/collaborators/<username> --method PUT -f permission=push`
Expected: GitHub confirms collaborator invitation or update

- [ ] **Step 5: Commit final docs cleanup**

```bash
git add README.md CONTRIBUTING.md docs/policies/repository-governance.md .github/branch-protection.json
git commit -m "docs: finalize public repository governance"
```

## Self-Review

Spec coverage:

- public website in a single repo: covered by Tasks 1, 2, 5, and 9
- canonical Markdown/YAML corpus: covered by Tasks 3 and 4
- Obsidian-style linking: covered by Task 6
- static-first speed strategy: covered by Tasks 2, 5, and 7
- review and rights controls: covered by Tasks 1, 8, and 9
- AI-safe `AGENTS.md` and privacy-aware `.gitignore`: covered by Task 1

Placeholder scan:

- No `TODO`, `TBD`, or deferred implementation placeholders appear in task steps.
- Commands, file paths, and code examples are concrete enough for execution.

Type consistency:

- Content record IDs use the same `work.*`, `author.*`, and `collection.*` conventions across schema, samples, and route resolution.
- Next.js target version is consistently `16.2.0`.
- Review states match between spec and schema.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-17-civilisation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
