# Library Rooms and Reader Design

## Summary

The Library of Civilisation currently presents its catalog as a single inline Index section on the homepage, grouping works by tradition but offering no way to enter a tradition on its own terms and no way to read an accessioned text. This design introduces two complementary surfaces — **rooms** (one per tradition) and a **reader** (one URL per chapter) — so that the library can be organised spatially and its texts can actually be picked up.

Each of the nine existing traditions becomes a room at `/rooms/[id]`. Each room landing opens with a restrained **typographic floor-plan** (a ruled, type-only sketch of the room's contents) followed by a clean prose index. Works with accessioned text are clickable and open the colophon at `/works/[slug]`, which offers a "Begin reading →" link into the reader at `/works/[slug]/text/[chapter]`. Works without text remain visible in the room but non-clickable, preserving archival honesty about what the library currently holds.

The homepage becomes a **lobby** — the nine rooms are listed as doors — with the manifesto, sources, and principles sections unchanged.

## Goals

- Make each tradition a first-class room with its own URL, editorial character, and curatorial framing.
- Give readers a way to actually read an accessioned text by clicking a book.
- Preserve the austere, archival, editorial, minimalist brand posture. The "spatial flourish" on a room landing is typographic, not illustrative.
- Distinguish "in the stacks" (has text) from "catalogued-only" (metadata only) without hiding the latter.
- Keep the system static-first: all rooms, colophons, and chapters render at build time.
- Move the tradition inventory out of inline component code and into the `library/` tree where the rest of the canonical content lives.

## Non-Goals

- Reader chrome (font size, theme, bookmarks, annotations, side-by-side translations). Deferred.
- Ingesting new chapter text beyond what is already committed. The reader works with what exists (The Iliad, Book 1).
- Accessioning workflow for new `work.md` files. Rooms carry catalogued-only entries until real work files appear.
- Filtering search by room. The existing `/search` page stays cross-cutting as today.
- Replacing the editorial homepage with a spatial/visual metaphor. The lobby remains typographic.
- Any 3D, canvas, or SVG rendering. The floor-plan is pure CSS + type.

## Information Architecture

Routes added or changed:

| Route | Status | Purpose |
|---|---|---|
| `/` | changed | Lobby. Nine rooms listed as doors. Manifesto / sources / principles sections retained. Inline Index section removed. |
| `/rooms/[id]` | new | Room landing. Typographic floor-plan header → clean prose index of entries in this tradition. |
| `/works/[slug]` | changed | Colophon. Adds "Text" section (chapter list) and "Begin reading →" when text is present; muted "Text not yet accessioned." when not. |
| `/works/[slug]/text/[chapter]` | new | Reader. One URL per chapter, deep-linkable. |
| `/catalog` | unchanged | Cross-cutting list of works, authors, collections. |
| `/search` | unchanged | Cross-cutting search; filters by discipline / era / language remain here. |
| `/authors/[slug]`, `/collections/[slug]` | unchanged | |

Room IDs reuse the existing tradition IDs from `apps/web/src/app/page.tsx`:
`ancient-near-east`, `chinese`, `indian`, `classical-western`, `islamic`, `japanese`, `african`, `americas`, `modern-global`.

The navbar (`site-header.tsx`) gains a **Rooms** link alongside Catalog and Search.

## Data Model

### Room files

New directory: `library/rooms/`. One markdown file per room: `library/rooms/{id}.md`.

Frontmatter shape (Zod schema in `packages/content/src/schema.ts`):

```yaml
---
id: classical-western
label: Greco-Roman
span: c. 750 BCE – 180 CE
note: Epic, geometry, rhetoric, empire.
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
---
```

`slug` is optional. When present, it references a `library/works/{slug}/` directory. When absent, the entry is a catalogued-only listing with no backing `work.md`.

The inventory currently inlined in `apps/web/src/app/page.tsx` (the `traditions` array) migrates verbatim into these nine files. The homepage reads from `loadRooms()` rather than an inline constant.

### Loaders

New exports from `packages/content`:

- `loadRoom(id): Promise<Room>` — parses `library/rooms/{id}.md` via Zod.
- `loadRooms(): Promise<Room[]>` — returns all rooms in a stable order matching the homepage's existing order.
- `workHasText(slug): Promise<boolean>` — returns `true` if `library/works/{slug}/text/` exists and contains at least one `*.md` file.
- `loadChapters(slug): Promise<Chapter[]>` — returns ordered `{ chapterSlug, title, file }[]`, sorted by filename prefix. `chapterSlug` is the filename with the leading `NN-` prefix and `.md` suffix removed (e.g., `01-book-1.md` → `book-1`).
- `loadChapter(slug, chapterSlug): Promise<{ frontmatter, body }>` — returns the parsed chapter frontmatter and raw markdown body for rendering.

All loaders run at build time. No runtime fetching.

### No schema changes to existing types

`work.md`, `author.md`, and `collection.md` schemas remain unchanged. Rooms are a new axis layered on top; existing `civilisations` arrays in work frontmatter are not used to derive room membership (they don't line up with the nine-room taxonomy, and most works don't exist as files yet).

## Lobby (`/`)

The homepage keeps:

- The hero (introduction, metrics, "Enter the archive" CTA).
- The manifesto section.
- The sources section.
- The principles section.
- The "What follows" promise card.

The homepage **removes** the current inline Index section (the `traditions.map(…)` block) and **replaces** the "Enter the archive" anchor (`#index`) target with a new **Lobby** section. The Lobby renders the nine rooms as doors:

- Large label (room name).
- cv-meta span (date range).
- One-line note.
- "Enter →" link to `/rooms/{id}`.

No floor-plan preview on the lobby. Each room is a door, not a window.

Metrics in the hero (total texts, tradition count, language count) are recomputed from `loadRooms()` so they stay truthful as room files change.

## Room Landing (`/rooms/[id]`)

Top of page: **typographic floor-plan**. A ruled box containing entries arranged in a 2–3 column grid:

```
┌─ CLASSICAL-WESTERN ────────── c. 750 BCE – 180 CE ─┐
│                                                    │
│   Homer           Plato          Euclid            │
│   ──────          ─────          ──────            │
│   Iliad           Republic       Elements          │
│                                                    │
│   Virgil          Marcus Aurelius                  │
│   ──────          ───────────────                  │
│   Aeneid          Meditations                      │
│                                                    │
└────────────────────────────────────────────────────┘
  Epic, geometry, rhetoric, empire.
```

Implementation:

- Rendered with CSS borders on a container + a CSS grid inside. Labels use the monospaced `cv-mono` utility already defined in the brand package. No canvas, no SVG.
- Each entry cell: author name (top), short horizontal rule, title (below).
- Entries with accessioned text get a subtle treatment (e.g., an underline on the title, or a leading `◆` marker). Catalogued-only entries render plain. The distinction must be legible but quiet.
- The floor-plan's header row shows the room `label` uppercased on the left and the `span` on the right, separated by the box's top rule.
- The room note sits directly below the box as a single italic line.
- Responsive: on viewports narrower than ~640px, the grid collapses to a single column but the ruled-box character is preserved.

Below the floor-plan: a **clean prose index**. This reuses the existing `.entries` list styling from `apps/web/src/app/globals.css`, rendering year / author / title / discipline / language per entry. Entries with accessioned text link to `/works/{slug}`; catalogued-only entries render as plain `<span>` text (no link).

`generateStaticParams` for `/rooms/[id]` returns all nine room IDs.

## Colophon Changes (`/works/[slug]`)

The existing colophon page adds one new section:

- **If text is present:** A "Text" section listing chapter titles as links to `/works/{slug}/text/{chapterSlug}`. Above the section, a primary "Begin reading →" CTA links to the first chapter.
- **If no text:** A single muted line below the metadata header: "Text not yet accessioned."

No other changes to the colophon. Related works, collections, and other existing sections remain.

`loadChapters(slug)` is called server-side in the page to build the chapter list.

## Reader (`/works/[slug]/text/[chapter]`)

A dedicated reading surface. Static at build time via `generateStaticParams`, which enumerates `(slug, chapterSlug)` pairs for every work that has accessioned chapters.

Layout (the existing `reader-layout.tsx` component is the basis; extend as needed):

- **Top:** breadcrumb `Room → Work → Chapter`. Chapter title as `<h1>`. Language and translator note as `cv-meta`.
- **Body:** single narrow prose column (~34rem measure), generous leading, no side chrome. Markdown rendered with `react-markdown` + `remark-gfm`.
- **Footer:** `← Previous chapter · Table of Contents · Next chapter →`. The TOC link points to `/works/{slug}` (the colophon, which lists chapters). Prev / Next are hidden when they don't apply (first / last chapter).

Bilingual content (The Iliad's Greek + English mixture) renders inline as authored in the markdown source. No split-column view in this spec.

### Markdown rendering

New dependency: `react-markdown` and `remark-gfm`, added to `apps/web/package.json`. Server-rendered (the reader page is a Server Component); no client bundle impact. No custom component overrides required for MVP — the defaults plus existing typography styles carry the load.

### Chapter URL slugs

The filename convention in `library/works/{slug}/text/` uses numeric prefixes for order (`01-book-1.md`, `02-book-2.md`, …). The URL slug is the filename with the `NN-` prefix and `.md` suffix stripped (`book-1`, `book-2`). The numeric prefix determines order but does not appear in URLs — URLs stay stable if chapters are renumbered.

## Visual Language

- Floor-plan: CSS-only ruled box. Uses existing `--color-line`, `--color-ink`, and typography tokens from `packages/brand`. No new tokens required.
- Room note: italic, single line, muted ink.
- "In the stacks" marker on entries with text: a leading `◆` glyph or an underline on the title. Choose one; keep it subtle.
- Lobby doors: single-column vertical list. Spacing generous. "Enter →" uses the existing accent color.
- Reader: inherits all brand typography. No new chrome.

The only new typographic element in this spec is the floor-plan box. Everything else reuses existing styles.

## Components

New or extended React components in `apps/web/src/components/`:

- `room-floor-plan.tsx` — renders the ruled box and entry grid. Props: `room: Room`, plus a set of slugs that have text (for the marker).
- `room-index.tsx` — renders the clean prose entry list below the floor-plan. Same props.
- `lobby-doors.tsx` — renders the nine-door list on the homepage.
- `chapter-nav.tsx` — the reader's footer nav (prev / TOC / next).
- `reader-layout.tsx` — existing; extended to accept chapter metadata and nav props.

Components stay focused and small. Each is independently readable and testable.

## Acceptance Criteria

1. `library/rooms/{id}.md` exists for all nine tradition IDs and parses successfully via `loadRooms()`.
2. Visiting `/` shows the lobby with nine clickable room doors. The previous inline Index section is gone.
3. Visiting `/rooms/classical-western` shows the typographic floor-plan, the clean index below, and the Iliad entry rendered with the "in the stacks" marker.
4. Visiting `/rooms/{any-other-id}` shows the same shape with appropriate content; no entries show the marker (no other works have text yet).
5. Clicking the Iliad in any room or the catalog lands on `/works/the-iliad`. The colophon shows "Begin reading →" and a chapter list with "Book I - The Rage of Achilles".
6. Clicking "Begin reading →" or the chapter link opens `/works/the-iliad/text/book-1`, rendering the Greek + English text correctly.
7. The reader footer shows "Table of Contents" (linked) and hides Prev/Next since only one chapter exists.
8. Entries in any room that have no backing `work.md` (or no text) are visible but not clickable.
9. Colophon for a textless work (hypothetical future case) shows "Text not yet accessioned."
10. All routes render statically at build. No runtime data fetching.
11. The navbar shows "Rooms" alongside Catalog and Search.

## Open Questions

- Choice of "in the stacks" marker: underline on title or leading `◆` glyph? Implementation may test both and pick the quieter one.
- Whether the chapter TOC link in the reader footer should go to `/works/{slug}` or to a dedicated `/works/{slug}/contents` anchor. Default: colophon, to keep the route count small.

Both are minor and can be resolved during implementation without revisiting the spec.
