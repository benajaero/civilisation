# Library Rooms and Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship nine tradition "rooms" with a typographic floor-plan and a static chapter reader, so users can enter a tradition and read accessioned texts chapter-by-chapter.

**Architecture:** Migrate the inline `traditions` inventory from `apps/web/src/app/page.tsx` into `library/rooms/{id}.md` files. Add five loaders to `packages/content` (`loadRoom`, `loadRooms`, `workHasText`, `loadChapters`, `loadChapter`) with Zod validation. Replace the homepage Index section with a lobby of room doors. Add `/rooms/[id]` (floor-plan + index) and `/works/[slug]/text/[chapter]` (markdown reader, `react-markdown` + `remark-gfm`). All pages statically generated; no runtime fetching.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · `@civilisation/content` (gray-matter + zod) · vitest + @testing-library/react · `react-markdown` + `remark-gfm` (new) · brand styles from `@civilisation/brand`.

**Spec:** `docs/superpowers/specs/2026-04-18-library-rooms-and-reader-design.md`

---

## File Structure

### Created

| File | Responsibility |
|---|---|
| `library/rooms/ancient-near-east.md` | Room entries for Mesopotamia & Egypt |
| `library/rooms/chinese.md` | Room entries for the Chinese tradition |
| `library/rooms/indian.md` | Room entries for the Indian tradition |
| `library/rooms/classical-western.md` | Room entries for Greco-Roman |
| `library/rooms/islamic.md` | Room entries for Islamic World |
| `library/rooms/japanese.md` | Room entries for Japanese |
| `library/rooms/african.md` | Room entries for African |
| `library/rooms/americas.md` | Room entries for Indigenous Americas |
| `library/rooms/modern-global.md` | Room entries for Modern & Global |
| `packages/content/src/load-room.ts` | `loadRoom`, `loadRooms` |
| `packages/content/src/load-chapters.ts` | `loadChapters`, `loadChapter`, `workHasText` |
| `packages/content/src/load-room.test.ts` | Unit tests for room loaders |
| `packages/content/src/load-chapters.test.ts` | Unit tests for chapter loaders |
| `apps/web/src/components/lobby-doors.tsx` | Homepage list of room doors |
| `apps/web/src/components/room-floor-plan.tsx` | Ruled-box typographic floor-plan |
| `apps/web/src/components/room-index.tsx` | Clean prose index under the floor-plan |
| `apps/web/src/components/chapter-nav.tsx` | Reader's prev/TOC/next footer |
| `apps/web/src/app/rooms/[id]/page.tsx` | Room landing route |
| `apps/web/src/app/works/[slug]/text/[chapter]/page.tsx` | Reader route |

### Modified

| File | Change |
|---|---|
| `packages/content/src/schema.ts` | Add `roomSchema`, `roomEntrySchema`, `Room`, `RoomEntry` |
| `packages/content/src/index.ts` | Export new loaders + types |
| `packages/content/package.json` | (no change; stays on gray-matter + zod) |
| `apps/web/package.json` | Add `react-markdown`, `remark-gfm` |
| `apps/web/src/app/page.tsx` | Replace inline `traditions` + Index section with lobby-doors consuming `loadRooms()` |
| `apps/web/src/app/page.test.tsx` | Update assertions for the new lobby content |
| `apps/web/src/app/works/[slug]/page.tsx` | Add chapter list + "Begin reading →" when text present; muted "Text not yet accessioned." when not |
| `apps/web/src/components/site-header.tsx` | Add "Rooms" nav link; prune stale anchor links |
| `apps/web/src/app/globals.css` | Add `.lobby`, `.room`, `.floor-plan`, `.chapter-nav` styles |

---

## Task 1: Add Room Schema

**Files:**
- Modify: `packages/content/src/schema.ts`

- [ ] **Step 1: Open the schema file**

Read `packages/content/src/schema.ts` to confirm current contents. Append the room schemas after the existing `collectionSchema` export.

- [ ] **Step 2: Append room schemas**

Append to `packages/content/src/schema.ts`:

```ts
export const roomEntrySchema = z.object({
  year: z.string(),
  author: z.string(),
  title: z.string(),
  native: z.string().optional(),
  language: z.string(),
  discipline: z.string(),
  slug: z.string().optional(),
});

export type RoomEntry = z.infer<typeof roomEntrySchema>;

export const roomSchema = z.object({
  id: z.string(),
  label: z.string(),
  span: z.string(),
  note: z.string(),
  order: z.number().int().nonnegative(),
  entries: z.array(roomEntrySchema).min(1),
});

export type Room = z.infer<typeof roomSchema>;
```

The `order` field lets us render rooms in a stable sequence matching the existing homepage order without relying on filename sort. `slug` on an entry is optional — absent means "catalogued only, no backing work.md".

- [ ] **Step 3: Typecheck the content package**

Run: `pnpm --filter @civilisation/content typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/content/src/schema.ts
git commit -m "feat(content): add room schema"
```

---

## Task 2: Implement loadRoom and loadRooms (TDD)

**Files:**
- Create: `packages/content/src/load-room.ts`
- Create: `packages/content/src/load-room.test.ts`
- Modify: `packages/content/src/index.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/content/src/load-room.test.ts`:

```ts
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRoom, loadRooms } from "./load-room";

const tmp = mkdtempSync(path.join(tmpdir(), "cv-rooms-"));

beforeAll(() => {
  mkdirSync(path.join(tmp, "rooms"), { recursive: true });
  writeFileSync(
    path.join(tmp, "rooms", "classical-western.md"),
    `---
id: classical-western
label: Greco-Roman
span: c. 750 BCE – 180 CE
note: Epic, geometry, rhetoric, empire.
order: 3
entries:
  - year: c. 750 BCE
    author: Homer
    title: The Iliad
    native: Ἰλιάς
    language: Greek
    discipline: Epic
    slug: the-iliad
  - year: c. 360 BCE
    author: Plato
    title: Republic
    language: Greek
    discipline: Philosophy
---
Curatorial body (ignored by loader).
`,
  );
  writeFileSync(
    path.join(tmp, "rooms", "chinese.md"),
    `---
id: chinese
label: Chinese
span: c. 1000 BCE – 1800 CE
note: A continuous tradition.
order: 1
entries:
  - year: c. 500 BCE
    author: Lao Tzu
    title: Tao Te Ching
    language: Classical Chinese
    discipline: Philosophy
---
`,
  );
  process.env.LIBRARY_PATH = tmp;
});

afterAll(() => {
  delete process.env.LIBRARY_PATH;
  rmSync(tmp, { recursive: true, force: true });
});

describe("loadRoom", () => {
  it("parses a single room file", async () => {
    const room = await loadRoom("classical-western");
    expect(room.id).toBe("classical-western");
    expect(room.label).toBe("Greco-Roman");
    expect(room.entries).toHaveLength(2);
    expect(room.entries[0]?.slug).toBe("the-iliad");
    expect(room.entries[1]?.slug).toBeUndefined();
  });
});

describe("loadRooms", () => {
  it("returns all rooms sorted by order", async () => {
    const rooms = await loadRooms();
    expect(rooms.map((r) => r.id)).toEqual(["chinese", "classical-western"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @civilisation/content vitest`
Expected: FAIL with "Cannot find module './load-room'".

- [ ] **Step 3: Implement the loaders**

Create `packages/content/src/load-room.ts`:

```ts
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { roomSchema, type Room } from "./schema";

const LIBRARY_ROOT = () => process.env.LIBRARY_PATH || process.cwd();

export async function loadRoom(id: string): Promise<Room> {
  const filePath = path.join(LIBRARY_ROOT(), "rooms", `${id}.md`);
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  return roomSchema.parse(parsed.data);
}

export async function loadRooms(): Promise<Room[]> {
  const dir = path.join(LIBRARY_ROOT(), "rooms");
  const files = await readdir(dir);
  const rooms = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map((f) => loadRoom(f.replace(/\.md$/, ""))),
  );
  return rooms.sort((a, b) => a.order - b.order);
}
```

`LIBRARY_ROOT` is a function, not a top-level constant, so `process.env.LIBRARY_PATH` is re-read after the test sets it.

- [ ] **Step 4: Export from the package**

Modify `packages/content/src/index.ts` — append:

```ts
export { loadRoom, loadRooms } from "./load-room";
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm --filter @civilisation/content vitest`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/content/src/load-room.ts packages/content/src/load-room.test.ts packages/content/src/index.ts
git commit -m "feat(content): add loadRoom and loadRooms"
```

---

## Task 3: Implement workHasText, loadChapters, loadChapter (TDD)

**Files:**
- Create: `packages/content/src/load-chapters.ts`
- Create: `packages/content/src/load-chapters.test.ts`
- Modify: `packages/content/src/index.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/content/src/load-chapters.test.ts`:

```ts
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  workHasText,
  loadChapters,
  loadChapter,
} from "./load-chapters";

const tmp = mkdtempSync(path.join(tmpdir(), "cv-chapters-"));

beforeAll(() => {
  const textDir = path.join(tmp, "works", "the-iliad", "text");
  mkdirSync(textDir, { recursive: true });
  writeFileSync(
    path.join(textDir, "01-book-1.md"),
    `---
id: text.the-iliad.book-1
work: work.the-iliad
book: 1
title: Book I - The Rage of Achilles
language: grc
---

# Book I
Line one.
`,
  );
  writeFileSync(
    path.join(textDir, "02-book-2.md"),
    `---
id: text.the-iliad.book-2
work: work.the-iliad
book: 2
title: Book II - The Catalogue
language: grc
---

# Book II
Line two.
`,
  );
  mkdirSync(path.join(tmp, "works", "empty-work"), { recursive: true });
  process.env.LIBRARY_PATH = tmp;
});

afterAll(() => {
  delete process.env.LIBRARY_PATH;
  rmSync(tmp, { recursive: true, force: true });
});

describe("workHasText", () => {
  it("returns true when text markdown files exist", async () => {
    expect(await workHasText("the-iliad")).toBe(true);
  });

  it("returns false when the work has no text directory", async () => {
    expect(await workHasText("empty-work")).toBe(false);
  });

  it("returns false for a missing work", async () => {
    expect(await workHasText("nonexistent")).toBe(false);
  });
});

describe("loadChapters", () => {
  it("returns chapters ordered by filename prefix with derived slugs", async () => {
    const chapters = await loadChapters("the-iliad");
    expect(chapters).toEqual([
      { chapterSlug: "book-1", title: "Book I - The Rage of Achilles", file: "01-book-1.md" },
      { chapterSlug: "book-2", title: "Book II - The Catalogue", file: "02-book-2.md" },
    ]);
  });
});

describe("loadChapter", () => {
  it("returns frontmatter and body for a chapter slug", async () => {
    const chapter = await loadChapter("the-iliad", "book-1");
    expect(chapter.frontmatter.title).toBe("Book I - The Rage of Achilles");
    expect(chapter.body).toContain("Line one.");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @civilisation/content vitest`
Expected: FAIL with "Cannot find module './load-chapters'".

- [ ] **Step 3: Implement the loaders**

Create `packages/content/src/load-chapters.ts`:

```ts
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const LIBRARY_ROOT = () => process.env.LIBRARY_PATH || process.cwd();

const chapterFrontmatterSchema = z.object({
  id: z.string(),
  work: z.string(),
  book: z.number().int().optional(),
  title: z.string(),
  language: z.string(),
});

export type ChapterFrontmatter = z.infer<typeof chapterFrontmatterSchema>;

export interface ChapterSummary {
  chapterSlug: string;
  title: string;
  file: string;
}

const textDir = (slug: string) =>
  path.join(LIBRARY_ROOT(), "works", slug, "text");

const deriveSlug = (filename: string): string =>
  filename.replace(/^\d+-/, "").replace(/\.md$/, "");

export async function workHasText(slug: string): Promise<boolean> {
  try {
    const s = await stat(textDir(slug));
    if (!s.isDirectory()) return false;
    const files = await readdir(textDir(slug));
    return files.some((f) => f.endsWith(".md"));
  } catch {
    return false;
  }
}

export async function loadChapters(slug: string): Promise<ChapterSummary[]> {
  const files = (await readdir(textDir(slug)))
    .filter((f) => f.endsWith(".md"))
    .sort();

  const summaries = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(textDir(slug), file), "utf8");
      const { data } = matter(source);
      const fm = chapterFrontmatterSchema.parse(data);
      return {
        chapterSlug: deriveSlug(file),
        title: fm.title,
        file,
      };
    }),
  );

  return summaries;
}

export async function loadChapter(
  slug: string,
  chapterSlug: string,
): Promise<{ frontmatter: ChapterFrontmatter; body: string }> {
  const files = (await readdir(textDir(slug))).filter((f) => f.endsWith(".md"));
  const file = files.find((f) => deriveSlug(f) === chapterSlug);
  if (!file) {
    throw new Error(`chapter not found: ${slug}/${chapterSlug}`);
  }
  const source = await readFile(path.join(textDir(slug), file), "utf8");
  const parsed = matter(source);
  return {
    frontmatter: chapterFrontmatterSchema.parse(parsed.data),
    body: parsed.content,
  };
}
```

- [ ] **Step 4: Export from the package**

Modify `packages/content/src/index.ts` — append:

```ts
export {
  workHasText,
  loadChapters,
  loadChapter,
  type ChapterSummary,
  type ChapterFrontmatter,
} from "./load-chapters";
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm --filter @civilisation/content vitest`
Expected: PASS (all tests green).

- [ ] **Step 6: Commit**

```bash
git add packages/content/src/load-chapters.ts packages/content/src/load-chapters.test.ts packages/content/src/index.ts
git commit -m "feat(content): add workHasText, loadChapters, loadChapter"
```

---

## Task 4: Migrate Tradition Inventory to library/rooms/

**Files:**
- Create: `library/rooms/ancient-near-east.md`
- Create: `library/rooms/chinese.md`
- Create: `library/rooms/indian.md`
- Create: `library/rooms/classical-western.md`
- Create: `library/rooms/islamic.md`
- Create: `library/rooms/japanese.md`
- Create: `library/rooms/african.md`
- Create: `library/rooms/americas.md`
- Create: `library/rooms/modern-global.md`

- [ ] **Step 1: Create all nine room files**

Source of truth: the `traditions` array in `apps/web/src/app/page.tsx` (lines 20–128). Copy entries verbatim. Only `the-iliad` gets a `slug` field (it's the only work with a `library/works/` directory). Keep the existing order via the `order` field.

Create `library/rooms/ancient-near-east.md`:

```markdown
---
id: ancient-near-east
label: Mesopotamia & Egypt
span: c. 2100 BCE – 300 BCE
note: The earliest written record of law, myth, and mortality.
order: 0
entries:
  - year: c. 2100 BCE
    author: Anonymous
    title: Epic of Gilgamesh
    native: 𒀭𒂍𒈾
    language: Akkadian
    discipline: Epic
  - year: c. 1754 BCE
    author: Hammurabi
    title: Code of Hammurabi
    native: 𒁹𒄩𒄠𒈬𒊏𒁉
    language: Akkadian
    discipline: Law
  - year: c. 1550 BCE
    author: Anonymous
    title: Book of the Dead
    native: 𓂋𓏤𓈖𓉐𓂋𓏏
    language: Egyptian
    discipline: Funerary
---
```

Create `library/rooms/chinese.md`:

```markdown
---
id: chinese
label: Chinese
span: c. 1000 BCE – 1800 CE
note: A continuous four-thousand-year textual tradition.
order: 1
entries:
  - year: c. 1000 BCE
    author: Anonymous
    title: I Ching
    native: 易經
    language: Classical Chinese
    discipline: Divination
  - year: c. 500 BCE
    author: Lao Tzu
    title: Tao Te Ching
    native: 道德經
    language: Classical Chinese
    discipline: Philosophy
  - year: c. 475 BCE
    author: Confucius (attr.)
    title: The Analects
    native: 論語
    language: Classical Chinese
    discipline: Ethics
  - year: c. 500 BCE
    author: Sun Tzu
    title: The Art of War
    native: 孫子兵法
    language: Classical Chinese
    discipline: Strategy
  - year: "1791"
    author: Cao Xueqin
    title: Dream of the Red Chamber
    native: 紅樓夢
    language: Classical Chinese
    discipline: Novel
---
```

Create `library/rooms/indian.md`:

```markdown
---
id: indian
label: Indian
span: c. 1500 BCE – 600 CE
note: "Veda, epic, sutra — the roots of Indic thought."
order: 2
entries:
  - year: c. 1500 BCE
    author: Anonymous
    title: Rigveda
    native: ऋग्वेद
    language: Vedic Sanskrit
    discipline: Scripture
  - year: c. 800 BCE
    author: Various ṛṣis
    title: Upaniṣads
    native: उपनिषद्
    language: Sanskrit
    discipline: Philosophy
  - year: c. 300 BCE
    author: Vyāsa (attr.)
    title: Bhagavad Gītā
    native: भगवद्गीता
    language: Sanskrit
    discipline: Philosophy
  - year: c. 300 BCE
    author: Kauṭilya
    title: Arthaśāstra
    native: अर्थशास्त्र
    language: Sanskrit
    discipline: Statecraft
---
```

Create `library/rooms/classical-western.md`:

```markdown
---
id: classical-western
label: Greco-Roman
span: c. 750 BCE – 180 CE
note: Epic, geometry, rhetoric, empire.
order: 3
entries:
  - year: c. 750 BCE
    author: Homer
    title: The Iliad
    native: Ἰλιάς
    language: Greek
    discipline: Epic
    slug: the-iliad
  - year: c. 360 BCE
    author: Plato
    title: Republic
    native: Πολιτεία
    language: Greek
    discipline: Philosophy
  - year: c. 300 BCE
    author: Euclid
    title: Elements
    native: Στοιχεῖα
    language: Greek
    discipline: Mathematics
  - year: 29 BCE
    author: Virgil
    title: The Aeneid
    native: Aenēis
    language: Latin
    discipline: Epic
  - year: 180 CE
    author: Marcus Aurelius
    title: Meditations
    native: Τὰ εἰς ἑαυτόν
    language: Greek
    discipline: Stoicism
---
```

Create `library/rooms/islamic.md`:

```markdown
---
id: islamic
label: Islamic World
span: 650 – 1400
note: Revelation, medicine, history, the thousand nights.
order: 4
entries:
  - year: c. 650
    author: Revealed to Muhammad
    title: Qur'an
    native: ٱلْقُرْآن
    language: Arabic
    discipline: Scripture
  - year: c. 1025
    author: Ibn Sīnā
    title: Canon of Medicine
    native: القانون في الطب
    language: Arabic
    discipline: Medicine
  - year: c. 1100
    author: Anonymous
    title: One Thousand & One Nights
    native: أَلْف لَيْلَة وَلَيْلَة
    language: Arabic
    discipline: Tales
  - year: "1377"
    author: Ibn Khaldūn
    title: Muqaddimah
    native: المقدمة
    language: Arabic
    discipline: History
---
```

Create `library/rooms/japanese.md`:

```markdown
---
id: japanese
label: Japanese
span: 712 – 1645
note: Court literature, chronicle, and the way of the sword.
order: 5
entries:
  - year: "712"
    author: Ō no Yasumaro
    title: Kojiki
    native: 古事記
    language: Old Japanese
    discipline: Chronicle
  - year: c. 1008
    author: Murasaki Shikibu
    title: Tale of Genji
    native: 源氏物語
    language: Heian Japanese
    discipline: Novel
  - year: "1645"
    author: Miyamoto Musashi
    title: Book of Five Rings
    native: 五輪書
    language: Japanese
    discipline: Strategy
---
```

Create `library/rooms/african.md`:

```markdown
---
id: african
label: African
span: c. 1200 – 1958
note: Oral epic, chronicle, and the modern African novel.
order: 6
entries:
  - year: c. 1235
    author: Anonymous
    title: Epic of Sundiata
    language: Mandinka
    discipline: Epic
  - year: c. 1321
    author: Anonymous
    title: Kebra Nagast
    native: ክብረ ነገሥት
    language: Ge'ez
    discipline: Chronicle
  - year: "1958"
    author: Chinua Achebe
    title: Things Fall Apart
    language: English
    discipline: Novel
---
```

Create `library/rooms/americas.md`:

```markdown
---
id: americas
label: Indigenous Americas
span: c. 1550 – 1888
note: The surviving record of pre-Columbian cosmology and voice.
order: 7
entries:
  - year: c. 1554
    author: Anonymous (K'iche')
    title: Popol Vuh
    language: K'iche' Maya
    discipline: Cosmology
  - year: "1569"
    author: Bernardino de Sahagún
    title: Florentine Codex
    native: Historia General
    language: Nahuatl / Spanish
    discipline: Ethnography
  - year: "1855"
    author: Walt Whitman
    title: Leaves of Grass
    language: English
    discipline: Poetry
---
```

Create `library/rooms/modern-global.md`:

```markdown
---
id: modern-global
label: Modern & Global
span: 1543 – present
note: The shared texts of the scientific and rights-bearing era.
order: 8
entries:
  - year: "1543"
    author: Copernicus
    title: De revolutionibus
    language: Latin
    discipline: Astronomy
  - year: "1687"
    author: Newton
    title: Principia Mathematica
    language: Latin
    discipline: Physics
  - year: "1859"
    author: Darwin
    title: On the Origin of Species
    language: English
    discipline: Biology
  - year: "1905"
    author: Einstein
    title: Annus Mirabilis Papers
    language: German
    discipline: Physics
  - year: "1948"
    author: United Nations
    title: Universal Declaration of Human Rights
    language: Multilingual
    discipline: Law
---
```

- [ ] **Step 2: Verify loaders parse the real files**

Add a temporary smoke script or run via node:

```bash
cd /Users/ebenezerajaero/Code/civilisation
LIBRARY_PATH=/Users/ebenezerajaero/Code/civilisation/library node --experimental-strip-types -e "
import('./packages/content/src/index.ts').then(async (m) => {
  const rooms = await m.loadRooms();
  console.log(rooms.length, rooms.map(r => r.id).join(','));
});
"
```

Expected: `9 ancient-near-east,chinese,indian,classical-western,islamic,japanese,african,americas,modern-global`.

If node's strip-types flag isn't available, skip this step — the next Next.js build task will catch parse errors.

- [ ] **Step 3: Commit**

```bash
git add library/rooms/
git commit -m "feat(library): migrate tradition inventory to library/rooms"
```

---

## Task 5: Install react-markdown, remark-gfm, and Fix Dev Script

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install packages**

Run: `pnpm --filter @civilisation/web add react-markdown remark-gfm`
Expected: dependencies added, lockfile updated.

- [ ] **Step 2: Update dev script to set LIBRARY_PATH**

The existing `build` script sets `LIBRARY_PATH` but `dev` does not, so content loaders fall back to `process.cwd()` (apps/web/) where `library/` does not exist. Update `apps/web/package.json` so `dev` matches `build`:

```json
"scripts": {
  "dev": "LIBRARY_PATH=/Users/ebenezerajaero/Code/civilisation/library next dev",
  "build": "LIBRARY_PATH=/Users/ebenezerajaero/Code/civilisation/library next build",
  "typecheck": "tsc --noEmit",
  "vitest": "vitest run"
}
```

- [ ] **Step 3: Verify types resolve**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "chore(web): add react-markdown and set LIBRARY_PATH for dev"
```

---

## Task 6: Build the Lobby Doors Component

**Files:**
- Create: `apps/web/src/components/lobby-doors.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Write the component**

Create `apps/web/src/components/lobby-doors.tsx`:

```tsx
import type { Room } from "@civilisation/content";

interface LobbyDoorsProps {
  rooms: Room[];
}

export function LobbyDoors({ rooms }: LobbyDoorsProps) {
  return (
    <ol className="lobby" aria-label="Rooms of the library">
      {rooms.map((room) => (
        <li key={room.id} className="lobby__door">
          <a href={`/rooms/${room.id}`} className="lobby__door-link">
            <div className="lobby__door-head">
              <h3 className="lobby__door-label">{room.label}</h3>
              <span className="cv-meta cv-mono">{room.span}</span>
            </div>
            <p className="lobby__door-note">{room.note}</p>
            <span className="lobby__door-enter">Enter &rarr;</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 2: Append lobby styles to globals.css**

Append to `apps/web/src/app/globals.css`:

```css
/* ========== Lobby (rooms on the homepage) ========== */

.lobby {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-ink);
}

.lobby__door {
  border-bottom: 1px solid var(--color-rule);
}

.lobby__door:last-child {
  border-bottom: 1px solid var(--color-ink);
}

.lobby__door-link {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem 2rem;
  padding: clamp(1.5rem, 3vw, 2.25rem) 0;
  text-decoration: none;
  color: var(--color-ink);
  transition: background 200ms ease;
}

.lobby__door-link:hover {
  background: rgba(22, 20, 18, 0.025);
}

.lobby__door-head {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.lobby__door-label {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 350;
  font-variation-settings: "opsz" 144;
  margin: 0;
  line-height: 1.05;
}

.lobby__door-note {
  grid-column: 1 / -1;
  font-style: italic;
  color: var(--color-muted-ink);
  max-width: 42rem;
  margin: 0;
}

.lobby__door-enter {
  align-self: start;
  font-family: var(--font-meta);
  font-size: 0.72rem;
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--color-ink);
  border-bottom: 1px solid var(--color-ink);
  padding-bottom: 2px;
  white-space: nowrap;
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/lobby-doors.tsx apps/web/src/app/globals.css
git commit -m "feat(web): add lobby-doors component and styles"
```

---

## Task 7: Rewrite the Homepage as a Lobby

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/page.test.tsx`

- [ ] **Step 1: Rewrite page.tsx**

Replace the entire contents of `apps/web/src/app/page.tsx` with:

```tsx
import { loadRooms } from "@civilisation/content";
import { SiteFrame } from "../components/site-frame";
import { LobbyDoors } from "../components/lobby-doors";

export const dynamic = "force-static";

type Source = {
  name: string;
  scope: string;
  url: string;
  license: string;
};

const sources: Source[] = [
  { name: "Project Gutenberg", scope: "70,000+ public-domain works, primarily European.", url: "https://www.gutenberg.org", license: "Public domain" },
  { name: "Chinese Text Project (ctext)", scope: "Pre-modern Chinese canon with parallel translation.", url: "https://ctext.org", license: "Public / CC" },
  { name: "Perseus Digital Library", scope: "Classical Greek and Latin texts with apparatus.", url: "https://www.perseus.tufts.edu", license: "CC BY-SA" },
  { name: "Wikisource", scope: "Multilingual community-verified editions.", url: "https://wikisource.org", license: "CC BY-SA" },
  { name: "Internet Archive", scope: "Scanned editions and preservation copies.", url: "https://archive.org", license: "Varies" },
  { name: "HathiTrust", scope: "Research-library scholarly archive.", url: "https://www.hathitrust.org", license: "Varies" },
  { name: "Sacred-Texts", scope: "Comparative religion and mythology.", url: "https://sacred-texts.com", license: "Public domain" },
  { name: "Digital Library of India", scope: "Sanskrit, Tamil, Bengali, and other Indic languages.", url: "https://dli.sanskritdictionary.com", license: "Varies" },
  { name: "Al-Maktaba al-Shamela", scope: "Classical Arabic and Islamic texts.", url: "https://shamela.ws", license: "Varies" },
  { name: "Bibliotheca Alexandrina", scope: "Arabic manuscripts and digital heritage.", url: "https://www.bibalex.org", license: "Varies" },
  { name: "World Digital Library (UNESCO)", scope: "Primary sources across world cultures.", url: "https://www.wdl.org", license: "Varies" },
  { name: "Europeana", scope: "European manuscripts, prints, and artworks.", url: "https://www.europeana.eu", license: "CC / PDM" }
];

const principles = [
  { id: "provenance", kicker: "I.", title: "Provenance", body: "Every text enters with a verified edition, translator, language, and rights basis. Upstream sources are named, not obscured." },
  { id: "plurality", kicker: "II.", title: "Plurality", body: "The canon is not one tradition. The library admits Greek and Sanskrit, Akkadian and K'iche', Arabic and Nahuatl." },
  { id: "longevity", kicker: "III.", title: "Longevity", body: "Static-first, open-format, mirrorable. The library should outlive its tools, its platforms, and its editors." },
  { id: "austerity", kicker: "IV.", title: "Austerity", body: "Typography carries the hierarchy. Surfaces stay quiet. Motion orients, never entertains." }
];

export default async function HomePage() {
  const rooms = await loadRooms();
  const totalTexts = rooms.reduce((sum, r) => sum + r.entries.length, 0);
  const languageSet = new Set(
    rooms.flatMap((r) => r.entries.map((e) => e.language.split(" / ")[0])),
  );

  return (
    <main>
      <SiteFrame>
        <section className="hero" aria-label="Introduction">
          <p className="cv-meta">Launch foundation · Editio Princeps · Across every civilisation</p>
          <h1 className="hero__title cv-display" aria-label="The Library of Civilisation">
            <span className="hero__title-line">The Library</span>
            <span className="hero__title-line hero__title-em">of Civilisation</span>
          </h1>
          <p className="hero__lede">
            Every civilisation&rsquo;s foundational texts, indexed in one place,
            held in public trust &mdash; from the Epic of Gilgamesh to the
            Universal Declaration, in the languages they were written.
          </p>
          <div className="hero__meta">
            <span className="cv-meta"><strong className="hero__metric">{totalTexts}</strong> texts</span>
            <span className="cv-meta"><strong className="hero__metric">{rooms.length}</strong> rooms</span>
            <span className="cv-meta"><strong className="hero__metric">{languageSet.size}+</strong> languages</span>
            <span className="cv-meta"><strong className="hero__metric">{sources.length}</strong> upstream sources</span>
            <span className="cv-meta">
              <a href="#lobby" className="hero__cta">Enter the archive</a>
            </span>
          </div>
        </section>
      </SiteFrame>

      <hr className="cv-rule" />

      <section id="manifesto" className="manifesto">
        <SiteFrame>
          <div className="manifesto__grid">
            <div>
              <p className="cv-meta cv-meta-ink">Editorial statement</p>
              <h2 className="manifesto__heading">
                A library is a promise that what was thought can be thought again &mdash;
                in every language it was thought in.
              </h2>
            </div>
            <div className="manifesto__body">
              <p className="manifesto__lead">
                <span className="dropcap">T</span>he written record of humanity
                is not a single canon. It is the braid of many &mdash; Sumerian
                tablet and Sanskrit sūtra, Greek elenchus and Chinese analect,
                Arabic commentary and K&rsquo;iche&rsquo; cosmology &mdash; each
                the infrastructure of a civilisation, each held unequally by the
                digital libraries that survived the twentieth century.
              </p>
              <p>
                Project Gutenberg gave the Western canon a public-domain home.
                ctext did the same for classical Chinese. Perseus for the
                Greco-Roman. Wikisource for the polyglot middle. Our task is
                the next one: to gather these traditions into a single,
                provenance-bearing archive that treats every civilisation as a
                first-class tradition &mdash; not an appendix.
              </p>
              <p>
                We ingest from verified upstream libraries, we credit them
                plainly, and we keep the sources open for mirroring. The
                ambition is scale. The discipline is provenance.
              </p>
              <p className="manifesto__sign">
                &mdash; The Editors, Ninth Heaven Library
              </p>
            </div>
          </div>
        </SiteFrame>
      </section>

      <hr className="cv-rule-double" />

      <section id="lobby" className="index" aria-labelledby="lobby-heading">
        <SiteFrame>
          <header className="index__head">
            <div>
              <p className="cv-meta">Section I</p>
              <h2 id="lobby-heading" className="index__heading">The Rooms</h2>
            </div>
            <p className="index__blurb">
              Nine rooms hold the library. Each is a tradition; each a door.
              Enter a room to see its index and to pick up its texts where they
              have been accessioned.
            </p>
          </header>

          <LobbyDoors rooms={rooms} />
        </SiteFrame>
      </section>

      <hr className="cv-rule" />

      <section id="sources" className="sources" aria-labelledby="sources-heading">
        <SiteFrame>
          <header className="sources__head">
            <div>
              <p className="cv-meta">Section II</p>
              <h2 id="sources-heading" className="sources__heading">Upstream Sources</h2>
            </div>
            <p className="sources__blurb">
              We ingest, verify, and rehouse. Every text in the archive carries
              its upstream attribution. These are the libraries we stand on.
            </p>
          </header>

          <ul className="sources__list">
            {sources.map((source) => (
              <li key={source.name} className="source">
                <div className="source__head">
                  <a className="source__name" href={source.url} target="_blank" rel="noreferrer noopener">
                    {source.name}
                  </a>
                  <span className="cv-meta cv-mono">{source.license}</span>
                </div>
                <p className="source__scope">{source.scope}</p>
              </li>
            ))}
          </ul>

          <p className="sources__note">
            Proposing a source or contesting an attribution? Editorial review
            is public. See <a href="#colophon">the colophon</a>.
          </p>
        </SiteFrame>
      </section>

      <section id="principles" className="principles">
        <SiteFrame>
          <header className="principles__head">
            <p className="cv-meta">Section III</p>
            <h2 className="principles__heading">Principles</h2>
            <p className="principles__blurb">
              Four rules govern what enters the library and how it is held.
            </p>
          </header>
          <ol className="principles__grid">
            {principles.map((p) => (
              <li key={p.id} className="principle">
                <span className="principle__kicker cv-mono">{p.kicker}</span>
                <h3 className="principle__title">{p.title}</h3>
                <p className="principle__body">{p.body}</p>
              </li>
            ))}
          </ol>
        </SiteFrame>
      </section>

      <section className="promise">
        <SiteFrame>
          <div className="promise__card">
            <p className="cv-meta cv-meta-ink">What follows</p>
            <h2 className="promise__heading">Editorial foundation first.</h2>
            <p className="promise__copy">
              The catalog, reading surfaces, and ingestion pipelines from
              Gutenberg, ctext, Perseus, Wikisource, and the rest arrive in
              subsequent plans. This foundation is the shell that will carry
              them &mdash; the masthead, the index, the principles, and the
              quiet paper they rest on.
            </p>
            <p className="cv-meta cv-mono promise__meta">
              Brand system in <code>packages/brand</code> &middot; Shell in{" "}
              <code>apps/web</code>
            </p>
          </div>
        </SiteFrame>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Update the homepage test**

Replace `apps/web/src/app/page.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@civilisation/content", () => ({
  loadRooms: async () => [
    {
      id: "classical-western",
      label: "Greco-Roman",
      span: "c. 750 BCE – 180 CE",
      note: "Epic, geometry, rhetoric, empire.",
      order: 3,
      entries: [
        {
          year: "c. 750 BCE",
          author: "Homer",
          title: "The Iliad",
          language: "Greek",
          discipline: "Epic",
          slug: "the-iliad",
        },
      ],
    },
  ],
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the archival threshold with a lobby of rooms", async () => {
    const ui = await HomePage();
    render(ui);

    expect(screen.getByRole("heading", { name: "The Library of Civilisation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Rooms" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Greco-Roman" })).toBeInTheDocument();
    expect(screen.getByText("Enter the archive")).toBeInTheDocument();
    expect(screen.getByText("Editorial foundation first.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the homepage test**

Run: `pnpm --filter @civilisation/web vitest`
Expected: PASS.

- [ ] **Step 4: Start the dev server and smoke the homepage**

Run (in a background terminal): `pnpm --filter @civilisation/web dev`
Open `http://localhost:3000/`. Verify:
- Nine rooms appear in the lobby.
- "Enter →" on each row.
- Manifesto, sources, principles, promise sections still render.
- No console errors.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/page.tsx apps/web/src/app/page.test.tsx
git commit -m "feat(web): rewrite homepage as lobby of rooms"
```

---

## Task 8: Build the Room Floor-Plan and Index Components

**Files:**
- Create: `apps/web/src/components/room-floor-plan.tsx`
- Create: `apps/web/src/components/room-index.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Write room-floor-plan.tsx**

Create `apps/web/src/components/room-floor-plan.tsx`:

```tsx
import type { Room } from "@civilisation/content";

interface RoomFloorPlanProps {
  room: Room;
  availableSlugs: Set<string>;
}

export function RoomFloorPlan({ room, availableSlugs }: RoomFloorPlanProps) {
  return (
    <figure className="floor-plan" aria-label={`Floor plan of the ${room.label} room`}>
      <div className="floor-plan__box">
        <div className="floor-plan__header">
          <span className="cv-mono floor-plan__header-label">
            {room.label.toUpperCase()}
          </span>
          <span className="cv-mono floor-plan__header-span">{room.span}</span>
        </div>
        <div className="floor-plan__grid">
          {room.entries.map((entry, i) => {
            const available = entry.slug ? availableSlugs.has(entry.slug) : false;
            return (
              <div
                key={`${room.id}-${i}`}
                className={
                  available
                    ? "floor-plan__cell floor-plan__cell--available"
                    : "floor-plan__cell"
                }
              >
                <span className="floor-plan__author">{entry.author}</span>
                <span className="floor-plan__rule" aria-hidden="true">&mdash;</span>
                <span className="floor-plan__title">{entry.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="floor-plan__note">{room.note}</figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: Write room-index.tsx**

Create `apps/web/src/components/room-index.tsx`:

```tsx
import type { Room } from "@civilisation/content";

interface RoomIndexProps {
  room: Room;
  availableSlugs: Set<string>;
}

export function RoomIndex({ room, availableSlugs }: RoomIndexProps) {
  return (
    <ol className="entries" aria-label={`Entries in ${room.label}`}>
      {room.entries.map((entry, i) => {
        const available = entry.slug ? availableSlugs.has(entry.slug) : false;
        const titleNode = (
          <>
            <em>{entry.title}</em>
            {entry.native ? (
              <span className="entry__native" lang="auto">
                {" "}&nbsp;·&nbsp; {entry.native}
              </span>
            ) : null}
          </>
        );

        return (
          <li key={`${room.id}-${i}`} className="entry">
            <span className="entry__year cv-mono">{entry.year}</span>
            <span className="entry__author">{entry.author}</span>
            <span className="entry__title">
              {available && entry.slug ? (
                <a href={`/works/${entry.slug}`} className="entry__link">
                  {titleNode}
                </a>
              ) : (
                titleNode
              )}
            </span>
            <span className="entry__discipline cv-meta">{entry.discipline}</span>
            <span className="entry__origin cv-meta cv-mono">{entry.language}</span>
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 3: Append floor-plan and room styles to globals.css**

Append to `apps/web/src/app/globals.css`:

```css
/* ========== Room landing ========== */

.room {
  padding: clamp(2.5rem, 5vw, 4rem) 0;
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
}

.room__crumbs {
  font-family: var(--font-meta);
  font-size: 0.72rem;
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--color-muted-ink);
}

.room__crumbs a {
  text-decoration: none;
  border-bottom: 1px solid var(--color-line);
  padding-bottom: 1px;
}

/* Floor plan */

.floor-plan {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.floor-plan__box {
  border: 1px solid var(--color-ink);
  padding: clamp(1rem, 2vw, 1.5rem);
  background: var(--color-paper);
}

.floor-plan__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-rule);
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ink);
}

.floor-plan__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  padding-top: clamp(1rem, 2vw, 1.5rem);
}

.floor-plan__cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--color-muted-ink);
}

.floor-plan__author {
  color: var(--color-ink);
  font-weight: 500;
}

.floor-plan__rule {
  color: var(--color-line);
}

.floor-plan__title {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-style: italic;
  color: var(--color-ink);
}

.floor-plan__cell--available .floor-plan__title {
  text-decoration: underline;
  text-decoration-color: var(--color-ink);
  text-underline-offset: 0.22em;
}

.floor-plan__note {
  font-style: italic;
  color: var(--color-muted-ink);
  font-size: 0.98rem;
}

.entry__link {
  color: var(--color-ink);
  text-decoration-color: var(--color-ink);
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/room-floor-plan.tsx apps/web/src/components/room-index.tsx apps/web/src/app/globals.css
git commit -m "feat(web): add room floor-plan and index components"
```

---

## Task 9: Build the Room Landing Route

**Files:**
- Create: `apps/web/src/app/rooms/[id]/page.tsx`

- [ ] **Step 1: Create the room route**

Create `apps/web/src/app/rooms/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { loadRoom, loadRooms, workHasText } from "@civilisation/content";
import { SiteFrame } from "../../../components/site-frame";
import { RoomFloorPlan } from "../../../components/room-floor-plan";
import { RoomIndex } from "../../../components/room-index";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const rooms = await loadRooms();
  return rooms.map((r) => ({ id: r.id }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let room;
  try {
    room = await loadRoom(id);
  } catch {
    notFound();
  }

  const availableSlugs = new Set<string>();
  await Promise.all(
    room.entries
      .filter((e) => e.slug)
      .map(async (e) => {
        if (e.slug && (await workHasText(e.slug))) {
          availableSlugs.add(e.slug);
        }
      }),
  );

  return (
    <main>
      <SiteFrame>
        <section className="room">
          <p className="room__crumbs">
            <a href="/">Lobby</a> &nbsp;·&nbsp; {room.label}
          </p>
          <RoomFloorPlan room={room} availableSlugs={availableSlugs} />
          <RoomIndex room={room} availableSlugs={availableSlugs} />
        </section>
      </SiteFrame>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 3: Smoke-test in the browser**

Run: `pnpm --filter @civilisation/web dev`
Open `http://localhost:3000/rooms/classical-western`. Verify:
- Breadcrumb "Lobby · Greco-Roman".
- Floor-plan box with Homer / Plato / Euclid / Virgil / Marcus Aurelius cells.
- The Iliad's title is underlined (marked available); others are plain.
- Clean index below lists all entries.
- The Iliad's title in the index is a link to `/works/the-iliad`.
- Visit `/rooms/chinese`, `/rooms/indian` — each renders with no links (no text yet).
- Visit `/rooms/nonexistent` — returns 404.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/rooms
git commit -m "feat(web): add room landing route with floor-plan"
```

---

## Task 10: Update the Colophon with Chapter List and Begin-Reading CTA

**Files:**
- Modify: `apps/web/src/app/works/[slug]/page.tsx`

- [ ] **Step 1: Rewrite the colophon**

Replace `apps/web/src/app/works/[slug]/page.tsx` with:

```tsx
import { loadWork, loadChapters, workHasText } from "@civilisation/content";

const PageFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-[72rem] px-[var(--layout-gutter)]">{children}</div>
);

export const dynamic = "force-static";

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
  const hasText = await workHasText(slug);
  const chapters = hasText ? await loadChapters(slug) : [];
  const firstChapter = chapters[0];

  return (
    <main>
      <PageFrame>
        <article className="py-12">
          <header className="mb-8">
            <p className="font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)] mb-2">
              {work.countries.join(", ")} · {work.civilisations.join(", ")}
            </p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">{work.title}</h1>
            <p className="mt-4 text-[var(--color-muted-ink)]">
              Available in: {work.available_languages.join(", ")}
            </p>
          </header>

          {hasText && firstChapter ? (
            <section className="border-t border-[var(--color-line)] pt-8 mt-8">
              <a
                href={`/works/${slug}/text/${firstChapter.chapterSlug}`}
                className="inline-block font-[var(--font-meta)] text-[0.78rem] uppercase tracking-[0.18em] border-b border-[var(--color-ink)] pb-1"
              >
                Begin reading &rarr;
              </a>
              <h2 className="text-lg font-medium mt-8 mb-4">Text</h2>
              <ol className="space-y-2 list-decimal pl-6">
                {chapters.map((ch) => (
                  <li key={ch.chapterSlug}>
                    <a
                      href={`/works/${slug}/text/${ch.chapterSlug}`}
                      className="text-[var(--color-accent)]"
                    >
                      {ch.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <p className="mt-8 italic text-[var(--color-muted-ink)]">
              Text not yet accessioned.
            </p>
          )}

          <section className="border-t border-[var(--color-line)] pt-8 mt-8">
            <h2 className="text-lg font-medium mb-4">Related Works</h2>
            <ul className="space-y-2">
              {work.links.related_works.map((id) => (
                <li key={id}>
                  <a href={`/works/${id.replace("work.", "")}`} className="text-[var(--color-accent)]">
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[var(--color-line)] pt-8 mt-8">
            <h2 className="text-lg font-medium mb-4">Collections</h2>
            <ul className="space-y-2">
              {work.links.collections.map((id) => (
                <li key={id}>
                  <a href={`/collections/${id.replace("collection.", "")}`} className="text-[var(--color-accent)]">
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </PageFrame>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 3: Smoke in the browser**

Run: `pnpm --filter @civilisation/web dev`
Open `http://localhost:3000/works/the-iliad`. Verify:
- "Begin reading →" CTA appears.
- "Text" section lists "Book I - The Rage of Achilles".

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/works/[slug]/page.tsx
git commit -m "feat(web): surface chapter list and begin-reading on colophon"
```

---

## Task 11: Build the Chapter Nav Component

**Files:**
- Create: `apps/web/src/components/chapter-nav.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Write chapter-nav.tsx**

Create `apps/web/src/components/chapter-nav.tsx`:

```tsx
interface ChapterNavProps {
  workSlug: string;
  workTitle: string;
  prev?: { chapterSlug: string; title: string };
  next?: { chapterSlug: string; title: string };
}

export function ChapterNav({ workSlug, workTitle, prev, next }: ChapterNavProps) {
  return (
    <nav className="chapter-nav" aria-label="Chapter navigation">
      <div className="chapter-nav__slot">
        {prev ? (
          <a
            href={`/works/${workSlug}/text/${prev.chapterSlug}`}
            className="chapter-nav__link"
          >
            <span className="cv-meta">&larr; Previous</span>
            <span className="chapter-nav__label">{prev.title}</span>
          </a>
        ) : null}
      </div>
      <div className="chapter-nav__slot chapter-nav__slot--center">
        <a href={`/works/${workSlug}`} className="chapter-nav__link">
          <span className="cv-meta">Contents</span>
          <span className="chapter-nav__label">{workTitle}</span>
        </a>
      </div>
      <div className="chapter-nav__slot chapter-nav__slot--end">
        {next ? (
          <a
            href={`/works/${workSlug}/text/${next.chapterSlug}`}
            className="chapter-nav__link"
          >
            <span className="cv-meta">Next &rarr;</span>
            <span className="chapter-nav__label">{next.title}</span>
          </a>
        ) : null}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Append chapter-nav styles to globals.css**

Append to `apps/web/src/app/globals.css`:

```css
/* ========== Reader ========== */

.reader {
  padding: clamp(2rem, 4vw, 3rem) 0 clamp(3rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.25rem);
}

.reader__meta {
  font-family: var(--font-meta);
  font-size: 0.72rem;
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--color-muted-ink);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.reader__meta a {
  text-decoration: none;
  border-bottom: 1px solid var(--color-line);
  padding-bottom: 1px;
}

.reader__title {
  font-family: var(--font-display);
  font-weight: 350;
  font-variation-settings: "opsz" 144;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  margin: 0;
}

.reader__body {
  max-width: 34rem;
  font-family: var(--font-body);
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-ink);
}

.reader__body h1,
.reader__body h2,
.reader__body h3 {
  font-family: var(--font-display);
  font-weight: 400;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.reader__body p {
  margin: 1rem 0;
}

.chapter-nav {
  border-top: 1px solid var(--color-ink);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem 0;
}

.chapter-nav__slot {
  display: flex;
  flex-direction: column;
}

.chapter-nav__slot--center {
  align-items: center;
  text-align: center;
}

.chapter-nav__slot--end {
  align-items: flex-end;
  text-align: right;
}

.chapter-nav__link {
  text-decoration: none;
  color: var(--color-ink);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.chapter-nav__label {
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-style: italic;
  color: var(--color-muted-ink);
}

.chapter-nav__link:hover .chapter-nav__label {
  color: var(--color-ink);
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/chapter-nav.tsx apps/web/src/app/globals.css
git commit -m "feat(web): add chapter-nav component and reader styles"
```

---

## Task 12: Build the Reader Route

**Files:**
- Create: `apps/web/src/app/works/[slug]/text/[chapter]/page.tsx`

- [ ] **Step 1: Create the reader route**

Create `apps/web/src/app/works/[slug]/text/[chapter]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  loadWork,
  loadChapters,
  loadChapter,
  workHasText,
} from "@civilisation/content";
import { SiteFrame } from "../../../../../components/site-frame";
import { ChapterNav } from "../../../../../components/chapter-nav";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const params: { slug: string; chapter: string }[] = [];
  for (const slug of ["the-iliad"]) {
    if (!(await workHasText(slug))) continue;
    const chapters = await loadChapters(slug);
    for (const ch of chapters) {
      params.push({ slug, chapter: ch.chapterSlug });
    }
  }
  return params;
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;

  const work = await loadWork(slug).catch(() => null);
  if (!work) notFound();

  const chapters = await loadChapters(slug);
  const index = chapters.findIndex((c) => c.chapterSlug === chapter);
  if (index === -1) notFound();

  const current = chapters[index];
  const loaded = await loadChapter(slug, chapter);
  const prev = index > 0 ? chapters[index - 1] : undefined;
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined;

  return (
    <main>
      <SiteFrame>
        <section className="reader">
          <p className="reader__meta">
            <a href={`/works/${slug}`}>{work.title}</a>
            <span>&middot;</span>
            <span>{loaded.frontmatter.language}</span>
          </p>
          <h1 className="reader__title">{current.title}</h1>
          <div className="reader__body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {loaded.body}
            </ReactMarkdown>
          </div>
          <ChapterNav
            workSlug={slug}
            workTitle={work.title}
            prev={prev ? { chapterSlug: prev.chapterSlug, title: prev.title } : undefined}
            next={next ? { chapterSlug: next.chapterSlug, title: next.title } : undefined}
          />
        </section>
      </SiteFrame>
    </main>
  );
}
```

The slug list in `generateStaticParams` is hardcoded to match the existing `generateStaticParams` in the colophon (`["the-iliad"]`). When new works are added, both lists update together.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 3: Smoke in the browser**

Run: `pnpm --filter @civilisation/web dev`
Open `http://localhost:3000/works/the-iliad/text/book-1`. Verify:
- Chapter title "Book I - The Rage of Achilles" rendered.
- Greek and English text both readable.
- Footer shows "Contents" link to `/works/the-iliad`. No prev/next since there's only one chapter.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/works/[slug]/text
git commit -m "feat(web): add chapter reader route"
```

---

## Task 13: Add Rooms Link to the Navbar

**Files:**
- Modify: `apps/web/src/components/site-header.tsx`

- [ ] **Step 1: Update the nav list**

In `apps/web/src/components/site-header.tsx`, replace the `<ul className="site-nav__list">` block with:

```tsx
<ul className="site-nav__list">
  <li><a href="/#lobby">Rooms</a></li>
  <li><a href="/catalog">Catalog</a></li>
  <li><a href="/search">Search</a></li>
  <li><a href="/#manifesto">Manifesto</a></li>
  <li><a href="/#principles">Principles</a></li>
</ul>
```

The old links pointed to in-page anchors that no longer exist (`#index`, `#epochs`, `#colophon`). Rooms links to the homepage lobby section; Manifesto and Principles follow the same pattern.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @civilisation/web typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/site-header.tsx
git commit -m "feat(web): wire Rooms nav link and prune stale anchors"
```

---

## Task 14: Full Build and Smoke Test

**Files:** none modified.

- [ ] **Step 1: Run the full build**

Run: `pnpm --filter @civilisation/web build`
Expected: build succeeds. Static pages generated for `/`, `/catalog`, `/search`, `/rooms/[id]` (9), `/works/the-iliad`, `/works/the-iliad/text/book-1`, `/authors/homer`, `/collections/greek-epics`.

- [ ] **Step 2: Run all tests**

Run: `pnpm vitest`
Expected: all green across content + web.

- [ ] **Step 3: Run all typechecks**

Run: `pnpm -r typecheck` (or per-package if -r fails: `pnpm --filter @civilisation/content typecheck && pnpm --filter @civilisation/web typecheck`).
Expected: no errors.

- [ ] **Step 4: Manual browser smoke**

Run: `pnpm --filter @civilisation/web dev`

Walk the acceptance criteria from the spec:

1. `/` shows the lobby with nine doors; the old Index section is gone.
2. `/rooms/classical-western` shows the floor-plan + index; The Iliad is underlined.
3. `/rooms/chinese`, `/rooms/modern-global` each render with no underlined entries (no other texts yet).
4. Click The Iliad from `/rooms/classical-western` → lands on `/works/the-iliad`.
5. Colophon shows "Begin reading →" and the chapter list.
6. Click "Begin reading →" → lands on `/works/the-iliad/text/book-1`.
7. Greek + English both render, no prev/next (single chapter), "Contents" link works.
8. Navbar "Rooms" link scrolls to the lobby section on home.
9. Visit `/rooms/not-a-real-room` → 404.
10. Visit `/works/the-iliad/text/book-99` → 404.

Stop the dev server.

- [ ] **Step 5: Commit (only if any fix-ups)**

If any small adjustments were needed during smoke (CSS tweaks, copy fixes), commit them:

```bash
git add -A
git commit -m "fix(web): adjustments from integration smoke"
```

Otherwise skip.

- [ ] **Step 6: Push**

```bash
git push origin main
```

---

## Acceptance Criteria (from spec — mirrored here for the final sweep)

1. `library/rooms/{id}.md` exists for all nine tradition IDs and parses successfully via `loadRooms()`. — Tasks 1, 2, 4.
2. `/` shows the lobby with nine clickable room doors; inline Index section gone. — Tasks 6, 7.
3. `/rooms/classical-western` shows floor-plan + clean index; Iliad entry rendered with the "in the stacks" marker. — Tasks 8, 9.
4. `/rooms/{any-other-id}` renders with appropriate content; no entries show the marker. — Task 9.
5. Clicking The Iliad from a room or the catalog lands on `/works/the-iliad`; colophon shows "Begin reading →" and chapter list. — Task 10.
6. "Begin reading →" or the chapter link opens `/works/the-iliad/text/book-1`, rendering Greek + English correctly. — Tasks 5, 11, 12.
7. Reader footer shows "Contents" (linked), hides Prev/Next when only one chapter exists. — Tasks 11, 12.
8. Entries without a backing `work.md` (or no text) are visible but not clickable. — Task 8.
9. Colophon for a textless work shows "Text not yet accessioned." — Task 10.
10. All routes render statically at build. — Task 14 Step 1.
11. Navbar shows "Rooms" alongside Catalog and Search. — Task 13.
