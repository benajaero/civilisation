# Library of Civilisation Launch Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the launch foundation for the Library of Civilisation: a governed monorepo, a canonical `packages/brand` system for launch primitives, and a branded Next.js shell that expresses the austere archival direction.

**Architecture:** Keep the repo narrow and brand-first. Bootstrap the workspace and policy files first, then create `packages/brand` as the single source of launch tokens, themes, styles, and shell primitives, and finally scaffold `apps/web` so it consumes the brand package rather than defining an independent visual system.

**Tech Stack:** Node.js 22, pnpm 10, TypeScript 5, Next.js 16.2, React 19, Vitest, Testing Library, Tailwind CSS 4, Zod

---

## File Structure

### Repository Bootstrap

- `package.json`: workspace scripts and root dev dependencies
- `pnpm-workspace.yaml`: workspace package discovery
- `tsconfig.base.json`: shared TypeScript defaults
- `.gitignore`: repo-wide ignores including local brainstorming artifacts
- `README.md`: high-level project overview and launch scope
- `AGENTS.md`: repository operating rules for contributors and agents
- `CONTRIBUTING.md`: contribution and review process summary
- `docs/policies/content-provenance.md`: provenance requirements
- `docs/policies/editorial-review.md`: editorial review and publication gating
- `tests/repo-structure.test.ts`: bootstrap existence checks

### Brand Package

- `packages/brand/package.json`: package metadata and export map
- `packages/brand/tsconfig.json`: package-local TypeScript config
- `packages/brand/src/tokens.ts`: launch token objects
- `packages/brand/src/theme.ts`: derived theme helpers and semantic aliases
- `packages/brand/src/styles.css`: exported global CSS variables and element rules
- `packages/brand/src/components.ts`: shell-level class helpers and shared config
- `packages/brand/src/index.ts`: package entrypoint
- `packages/brand/docs/principles.md`: prose guidance for tone, hierarchy, and usage
- `tests/brand-package.test.ts`: verifies package surface and critical token values

### Web Shell

- `apps/web/package.json`: app scripts and dependencies
- `apps/web/tsconfig.json`: app TypeScript config
- `apps/web/next.config.ts`: Next.js configuration
- `apps/web/postcss.config.mjs`: PostCSS/Tailwind integration
- `apps/web/src/app/globals.css`: imports brand CSS and app-level composition rules
- `apps/web/src/app/layout.tsx`: root layout and shell frame
- `apps/web/src/app/page.tsx`: homepage proof
- `apps/web/src/components/site-header.tsx`: launch header
- `apps/web/src/components/site-footer.tsx`: launch footer
- `apps/web/src/components/site-frame.tsx`: page-width and rhythm wrapper
- `apps/web/src/app/page.test.tsx`: homepage proof test
- `apps/web/src/components/site-shell.test.tsx`: shell rendering tests

---

### Task 1: Bootstrap The Workspace And Governance Baseline

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
- Test: `tests/repo-structure.test.ts`

- [ ] **Step 1: Write the failing bootstrap test**

```ts
// tests/repo-structure.test.ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("repository bootstrap", () => {
  it("contains the required launch-foundation files", () => {
    expect(existsSync("package.json")).toBe(true);
    expect(existsSync("pnpm-workspace.yaml")).toBe(true);
    expect(existsSync("tsconfig.base.json")).toBe(true);
    expect(existsSync("README.md")).toBe(true);
    expect(existsSync("AGENTS.md")).toBe(true);
    expect(existsSync("CONTRIBUTING.md")).toBe(true);
    expect(existsSync("docs/policies/content-provenance.md")).toBe(true);
    expect(existsSync("docs/policies/editorial-review.md")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/repo-structure.test.ts`
Expected: FAIL with missing `package.json` or missing policy files

- [ ] **Step 3: Write the minimal workspace and governance files**

```json
// package.json
{
  "name": "civilisation",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "build": "pnpm --filter @civilisation/web build",
    "dev": "pnpm --filter @civilisation/web dev",
    "test": "vitest run",
    "typecheck": "pnpm -r typecheck"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
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

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "baseUrl": "."
  }
}
```

```gitignore
# dependencies
node_modules/

# build output
.next/
dist/
coverage/

# local env
.env
.env.*
.DS_Store

# local research / visual companion
.superpowers/
```

```md
# README.md

## Library of Civilisation

Library of Civilisation is a static-first public library project. This launch-foundation phase establishes the repository, governance baseline, canonical brand package, and branded web shell.

Current implementation scope:

- monorepo bootstrap
- governance and provenance rules
- `packages/brand`
- `apps/web` shell and homepage proof
```

```md
# AGENTS.md

## Repository Rules

- Do not commit private notes, unpublished internal material, or unclear-rights content.
- Treat `packages/brand` as the canonical source of launch brand primitives.
- Keep `apps/web` as a consumer of brand primitives rather than a second design system.
- Prefer small, reviewable changes with tests.
```

```md
# CONTRIBUTING.md

## Contributing

All changes to `main` go through pull requests.

- Use `docs/` for governance and planning changes.
- Use `packages/brand` for launch visual primitives and guidance.
- Use `apps/web` for the website shell and composition.
- Require review before merge.
```

```md
# docs/policies/content-provenance.md

## Content Provenance

Every published text must have explicit provenance and rights basis. Unverified material does not enter the canonical library.
```

```md
# docs/policies/editorial-review.md

## Editorial Review

The repository is open to contribution but not open publication. Publication requires explicit approval by designated maintainers.
```

- [ ] **Step 4: Run tests to verify bootstrap passes**

Run: `pnpm install && pnpm vitest tests/repo-structure.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore README.md AGENTS.md CONTRIBUTING.md docs/policies/content-provenance.md docs/policies/editorial-review.md tests/repo-structure.test.ts
git commit -m "chore: bootstrap launch foundation workspace"
```

### Task 2: Create The Canonical Launch Brand Package

**Files:**
- Create: `packages/brand/package.json`
- Create: `packages/brand/tsconfig.json`
- Create: `packages/brand/src/tokens.ts`
- Create: `packages/brand/src/theme.ts`
- Create: `packages/brand/src/styles.css`
- Create: `packages/brand/src/components.ts`
- Create: `packages/brand/src/index.ts`
- Create: `packages/brand/docs/principles.md`
- Test: `tests/brand-package.test.ts`

- [ ] **Step 1: Write the failing brand package test**

```ts
// tests/brand-package.test.ts
import { describe, expect, it } from "vitest";
import { colorTokens, spacingTokens, typographyTokens } from "../packages/brand/src/tokens";

describe("brand package", () => {
  it("defines launch tokens for austere editorial surfaces", () => {
    expect(colorTokens.canvas).toBe("#f4f0e8");
    expect(colorTokens.ink).toBe("#161412");
    expect(spacingTokens["layout-gutter"]).toBe("clamp(1.25rem, 2vw, 2rem)");
    expect(typographyTokens.display.family).toContain("Fraunces");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/brand-package.test.ts`
Expected: FAIL with missing `packages/brand/src/tokens.ts`

- [ ] **Step 3: Write the package manifest and token source**

```json
// packages/brand/package.json
{
  "name": "@civilisation/brand",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./styles.css": "./src/styles.css"
  }
}
```

```json
// packages/brand/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

```ts
// packages/brand/src/tokens.ts
export const colorTokens = {
  canvas: "#f4f0e8",
  paper: "#ebe4d6",
  ink: "#161412",
  mutedInk: "#4b443d",
  line: "#b8aa96",
  accent: "#6f5d43"
} as const;

export const spacingTokens = {
  "layout-gutter": "clamp(1.25rem, 2vw, 2rem)",
  "section-gap": "clamp(3rem, 7vw, 6rem)",
  "measure-wide": "72rem",
  "measure-reading": "42rem"
} as const;

export const typographyTokens = {
  display: {
    family: "\"Fraunces\", \"Iowan Old Style\", serif",
    size: "clamp(2.75rem, 6vw, 5.5rem)",
    tracking: "-0.04em"
  },
  body: {
    family: "\"Source Serif 4\", Georgia, serif",
    size: "1.05rem",
    lineHeight: "1.75"
  },
  meta: {
    family: "\"IBM Plex Sans\", sans-serif",
    size: "0.8rem",
    tracking: "0.08em"
  }
} as const;
```

- [ ] **Step 4: Add theme helpers, exported CSS, and prose principles**

```ts
// packages/brand/src/theme.ts
import { colorTokens, spacingTokens, typographyTokens } from "./tokens";

export const launchTheme = {
  color: colorTokens,
  spacing: spacingTokens,
  type: typographyTokens
} as const;
```

```css
/* packages/brand/src/styles.css */
:root {
  --color-canvas: #f4f0e8;
  --color-paper: #ebe4d6;
  --color-ink: #161412;
  --color-muted-ink: #4b443d;
  --color-line: #b8aa96;
  --color-accent: #6f5d43;
  --layout-gutter: clamp(1.25rem, 2vw, 2rem);
  --section-gap: clamp(3rem, 7vw, 6rem);
  --measure-wide: 72rem;
  --measure-reading: 42rem;
  --font-display: "Fraunces", "Iowan Old Style", serif;
  --font-body: "Source Serif 4", Georgia, serif;
  --font-meta: "IBM Plex Sans", sans-serif;
}

html {
  background: var(--color-canvas);
  color: var(--color-ink);
}

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.75;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.04em;
}
```

```ts
// packages/brand/src/components.ts
export const shellClasses = {
  pageFrame: "mx-auto w-full max-w-[72rem] px-[var(--layout-gutter)]",
  readingMeasure: "max-w-[42rem]",
  metaRow: "font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)]"
} as const;
```

```ts
// packages/brand/src/index.ts
export * from "./tokens";
export * from "./theme";
export * from "./components";
```

```md
# packages/brand/docs/principles.md

## Launch Principles

- The interface should feel austere, archival, editorial, and minimalist.
- Typography carries hierarchy; surfaces stay quiet.
- Accent color is rare and structural, not decorative.
- Motion should orient, not entertain.
- The shell should read like a threshold to an archive, not a startup homepage.
```

- [ ] **Step 5: Run tests to verify the brand package passes**

Run: `pnpm vitest tests/brand-package.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/brand tests/brand-package.test.ts
git commit -m "feat: add launch brand package"
```

### Task 3: Scaffold The Web App As A Consumer Of The Brand Package

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/layout.tsx`
- Test: `apps/web/src/components/site-shell.test.tsx`

- [ ] **Step 1: Write the failing shell bootstrap test**

```tsx
// apps/web/src/components/site-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout from "../app/layout";

describe("RootLayout", () => {
  it("renders the library shell title and children", () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Library of Civilisation")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/web vitest src/components/site-shell.test.tsx`
Expected: FAIL with missing app package or layout component

- [ ] **Step 3: Write the minimal Next.js app manifest and root config**

```json
// apps/web/package.json
{
  "name": "@civilisation/web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "vitest": "vitest run"
  },
  "dependencies": {
    "@civilisation/brand": "workspace:*",
    "next": "16.2.0",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2"
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "plugins": [{ "name": "next" }]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"]
}
```

```ts
// apps/web/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true
};

export default nextConfig;
```

```js
// apps/web/postcss.config.mjs
export default {
  plugins: {}
};
```

- [ ] **Step 4: Write the root layout that imports the brand CSS**

```css
/* apps/web/src/app/globals.css */
@import "@civilisation/brand/styles.css";

body {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration-color: var(--color-line);
  text-underline-offset: 0.18em;
}
```

```tsx
// apps/web/src/app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <div>Library of Civilisation</div>
        </header>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run tests and typecheck**

Run: `pnpm install && pnpm --filter @civilisation/web vitest src/components/site-shell.test.tsx && pnpm --filter @civilisation/web typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web package.json pnpm-workspace.yaml
git commit -m "feat: scaffold web app on brand package"
```

### Task 4: Build The Branded Core Shell Components

**Files:**
- Create: `apps/web/src/components/site-frame.tsx`
- Create: `apps/web/src/components/site-header.tsx`
- Create: `apps/web/src/components/site-footer.tsx`
- Modify: `apps/web/src/app/layout.tsx`
- Test: `apps/web/src/components/site-shell.test.tsx`

- [ ] **Step 1: Extend the shell test to verify branded navigation structure**

```tsx
// apps/web/src/components/site-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout from "../app/layout";

describe("RootLayout", () => {
  it("renders the launch shell with archive framing", () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Library of Civilisation")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
    expect(screen.getByText("Texts")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/web vitest src/components/site-shell.test.tsx`
Expected: FAIL because `Archive`, `Texts`, or footer elements are missing

- [ ] **Step 3: Implement the frame, header, and footer using brand exports**

```tsx
// apps/web/src/components/site-frame.tsx
import { shellClasses } from "@civilisation/brand";

export function SiteFrame({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={shellClasses.pageFrame}>{children}</div>;
}
```

```tsx
// apps/web/src/components/site-header.tsx
import { shellClasses } from "@civilisation/brand";
import { SiteFrame } from "./site-frame";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-line)]" role="banner">
      <SiteFrame>
        <div className="flex items-center justify-between py-6">
          <div>
            <div className={shellClasses.metaRow}>Ninth Heaven Library</div>
            <div className="font-[var(--font-display)] text-2xl">Library of Civilisation</div>
          </div>
          <nav aria-label="Primary">
            <ul className="flex gap-6 list-none m-0 p-0 font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem]">
              <li><a href="/">Archive</a></li>
              <li><a href="/">Texts</a></li>
              <li><a href="/">About</a></li>
            </ul>
          </nav>
        </div>
      </SiteFrame>
    </header>
  );
}
```

```tsx
// apps/web/src/components/site-footer.tsx
import { SiteFrame } from "./site-frame";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-24" role="contentinfo">
      <SiteFrame>
        <div className="py-10 text-sm text-[var(--color-muted-ink)]">
          Public archive foundation under editorial care.
        </div>
      </SiteFrame>
    </footer>
  );
}
```

- [ ] **Step 4: Compose the final root layout**

```tsx
// apps/web/src/app/layout.tsx
import "./globals.css";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run tests and typecheck**

Run: `pnpm --filter @civilisation/web vitest src/components/site-shell.test.tsx && pnpm --filter @civilisation/web typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components apps/web/src/app/layout.tsx
git commit -m "feat: add branded launch shell"
```

### Task 5: Build The Homepage Proof For The Archive Threshold

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/page.test.tsx`

- [ ] **Step 1: Write the failing homepage proof test**

```tsx
// apps/web/src/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("presents an archival threshold rather than a marketing grid", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "The Library of Civilisation" })).toBeInTheDocument();
    expect(
      screen.getByText(/a repository of the works that built the world/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter the archive")).toBeInTheDocument();
    expect(screen.getByText("Editorial foundation first.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @civilisation/web vitest src/app/page.test.tsx`
Expected: FAIL with missing homepage module or content

- [ ] **Step 3: Implement the homepage proof**

```tsx
// apps/web/src/app/page.tsx
import { SiteFrame } from "../components/site-frame";

export default function HomePage() {
  return (
    <main>
      <SiteFrame>
        <section className="py-20">
          <p className="font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)]">
            Launch foundation
          </p>
          <h1 className="max-w-[12ch] text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92]">
            The Library of Civilisation
          </h1>
          <p className="max-w-[42rem] text-xl text-[var(--color-muted-ink)]">
            A repository of the works that built the world.
          </p>
        </section>

        <section className="grid gap-8 border-t border-[var(--color-line)] py-10 md:grid-cols-[2fr_1fr]">
          <div className="max-w-[42rem]">
            <p>
              The launch shell establishes the archive&apos;s visual and editorial posture before the
              wider catalog, reading surfaces, and content systems are introduced.
            </p>
            <a className="inline-block mt-6" href="/">
              Enter the archive
            </a>
          </div>
          <div className="text-sm text-[var(--color-muted-ink)]">
            <p>Editorial foundation first.</p>
            <p>Brand system in `packages/brand`.</p>
            <p>Catalog and work pages follow in later plans.</p>
          </div>
        </section>
      </SiteFrame>
    </main>
  );
}
```

- [ ] **Step 4: Run tests and a production build**

Run: `pnpm --filter @civilisation/web vitest src/app/page.test.tsx && pnpm --filter @civilisation/web build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/page.tsx apps/web/src/app/page.test.tsx
git commit -m "feat: add launch homepage proof"
```

### Task 6: Add A Brand Documentation And Stability Checkpoint

**Files:**
- Modify: `README.md`
- Modify: `packages/brand/docs/principles.md`
- Test: `tests/brand-package.test.ts`

- [ ] **Step 1: Extend the brand test to verify prose guidance exists**

```ts
// tests/brand-package.test.ts
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { colorTokens, spacingTokens, typographyTokens } from "../packages/brand/src/tokens";

describe("brand package", () => {
  it("defines launch tokens for austere editorial surfaces", () => {
    expect(colorTokens.canvas).toBe("#f4f0e8");
    expect(colorTokens.ink).toBe("#161412");
    expect(spacingTokens["layout-gutter"]).toBe("clamp(1.25rem, 2vw, 2rem)");
    expect(typographyTokens.display.family).toContain("Fraunces");
  });

  it("ships written principles for launch usage", () => {
    expect(existsSync("packages/brand/docs/principles.md")).toBe(true);
    expect(readFileSync("packages/brand/docs/principles.md", "utf8")).toContain(
      "austere, archival, editorial, and minimalist",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/brand-package.test.ts`
Expected: FAIL if the phrase or file is missing

- [ ] **Step 3: Tighten the docs to reflect canonical launch usage**

```md
# README.md

## Library of Civilisation

Library of Civilisation is a static-first public library project.

This repository currently implements the launch foundation:

- governance baseline
- canonical launch brand package in `packages/brand`
- branded web shell in `apps/web`

The visual direction is austere, archival, editorial, and minimalist.
Later plans will add content records, ingestion, and reading surfaces.
```

```md
# packages/brand/docs/principles.md

## Launch Principles

The launch system is austere, archival, editorial, and minimalist.

- Typography carries hierarchy.
- Surfaces remain quiet and paper-like.
- Structural rules are visible.
- Accent color is scarce.
- Motion is restrained.
- The shell should feel like a threshold to an archive.
```

- [ ] **Step 4: Run the full verification set**

Run: `pnpm test && pnpm --filter @civilisation/web build && pnpm -r typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add README.md packages/brand/docs/principles.md tests/brand-package.test.ts
git commit -m "docs: finalize launch foundation guidance"
```

---

## Self-Review

- Spec coverage:
  - Repo bootstrap and governance baseline: covered by Task 1.
  - Canonical `packages/brand` system with tokens, styles, and prose rules: covered by Tasks 2 and 6.
  - `apps/web` consuming the brand package rather than inventing local foundations: covered by Tasks 3 and 4.
  - Homepage proof as archival threshold: covered by Task 5.
  - Narrow execution boundary excluding full catalog and content systems: maintained by omission and task scoping.

- Placeholder scan:
  - No `TBD`, `TODO`, or deferred-code placeholders remain inside task steps.
  - Commands and expected results are explicit for each checkpoint.

- Type consistency:
  - `shellClasses` is defined in `packages/brand/src/components.ts` and consumed consistently in shell components.
  - Token names in tests match token names in `packages/brand/src/tokens.ts`.
  - File paths used in commands match the files introduced in each task.
