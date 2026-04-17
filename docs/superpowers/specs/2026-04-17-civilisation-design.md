# Library of Civilisation Design

## Summary

`civilisation` is a public GitHub repository for a static-first website and canonical content library that publishes open-source, public-domain, and copyright-free works in an accessible reading experience. The project is designed by NH Group and curated by NHLAA, with community contributions accepted through pull requests and publication controlled by Ebenezer Ajaero plus approved maintainers and reviewers.

The repository must remain safe for public development. Private notes, internal Obsidian material, unpublished source documents, and unverified copyright material must never become part of the canonical repository. The system should favor transparent file-based content over opaque runtime infrastructure so contributors can read, review, and improve the corpus directly.

## Goals

- Build a public website that reads fast, feels accessible, and can scale into a large multilingual library.
- Use a file-based content model that is pleasant for humans to edit and straightforward for machines to validate.
- Support contributions of full texts, metadata, translations, and annotations through an approval workflow.
- Preserve explicit provenance, rights basis, and review status for every published work.
- Support Obsidian-like linking between works, authors, collections, languages, and related records.
- Keep the first version operationally simple by avoiding a runtime database requirement.

## Non-Goals

- Importing private Obsidian notes or unpublished internal records into the public repository.
- Publishing copyrighted text without explicit free-culture or public-domain basis.
- Building a complex ingestion pipeline or database-backed CMS in the first version.
- Allowing unreviewed user submissions to appear on the public website automatically.

## Product Direction

The repository will be website-first, but the website and corpus will live together in a single public repository. The website should consume canonical content from the repository itself so contributors can trace what is published back to the source files in version control.

The product direction is static-first. Content should be ingested at build time, normalized into deterministic routes and indexes, and emitted as static pages and static search artifacts wherever possible. This preserves site speed, reduces operational burden, and keeps the contribution model close to plain files.

## Repository Shape

Recommended top-level structure:

```text
civilisation/
  apps/
    web/
  library/
    works/
    authors/
    collections/
    languages/
  docs/
    policies/
    architecture/
    superpowers/
      specs/
      plans/
  .github/
```

Responsibilities:

- `apps/web/`: public-facing website application.
- `library/works/`: canonical work folders, one folder per work.
- `library/authors/`: author records referenced by works.
- `library/collections/`: curated groupings, canons, themes, and series.
- `library/languages/`: language metadata and rendering rules.
- `docs/policies/`: editorial, legal, moderation, provenance, and contributor rules.
- `.github/`: templates, workflows, CODEOWNERS, and automation policy.

## Canonical Content Model

Markdown with YAML front matter is the source of truth. The canonical editorial unit is a work folder under `library/works/<work-slug>/`.

Required per-work files:

- `work.md`
- `sources.md`

Optional per-work files:

- `text/*.md` for long works split into chapters or sections
- `translations/<lang-code>/...` for translated variants
- `annotations/*.md` for editorial or scholarly notes
- `assets/*` for required public assets
- `manifest.yml` if a work grows large enough to justify explicit structure beyond front matter

Recommended work folder structure:

```text
library/works/the-iliad/
  work.md
  sources.md
  text/
    01-book-1.md
    02-book-2.md
  translations/
    en/
      work.md
      text/
    el/
      work.md
      text/
  annotations/
    notes.en.md
```

## Work Metadata Requirements

Each work must include a stable ID, slug, title, author linkage, geographic attribution, language data, provenance, rights basis, and review status.

Baseline front matter shape:

```yaml
id: work.the-iliad
slug: the-iliad
title: The Iliad
original_title: Iliad
authors:
  - author.homer
countries:
  - greece
contributors: []
translators: []
language: grc
available_languages:
  - grc
  - en
civilisations:
  - ancient-greece
genres:
  - epic
tags:
  - poetry
  - war
links:
  related_works:
    - work.the-odyssey
  related_authors:
    - author.homer
  collections:
    - collection.greek-epics
dates:
  composed: "0800 BCE"
  source_edition: "1920"
rights:
  status: public_domain
  basis: public_domain
  notes: "Original work is public domain; source edition verified as public domain."
source:
  name: "Perseus Digital Library"
  url: "https://example.org"
  retrieved: "2026-04-17"
  edition: "Example edition"
review:
  status: published
  approved_by:
    - ebenezerajaero
summary: "Epic poem attributed to Homer."
```

Notes:

- `authors` is required and should reference canonical author records.
- `countries` is required at the work level for geographic attribution of the work.
- `author_countries` should not be canonical work metadata by default; if needed for search or faceting, derive it from author records at build time.
- `review.status` should support at least `draft`, `submitted`, `under_review`, `approved`, and `published`.
- Only `published` works should be public by default on the website.

## Linked Records

The repository should support Obsidian-like linking behavior without depending on raw filesystem assumptions at runtime. Linking should be implemented through stable IDs and slugs so the site generator can resolve cross-references reliably.

Required linked record types:

- works to related works
- works to authors
- works to collections
- works to languages
- works to annotations
- collections to works
- authors to works

Author records under `library/authors/<slug>.md` should include richer author metadata, for example:

```yaml
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
```

The build system should resolve links into static routes, backlinks, and related-content surfaces without requiring a runtime query layer.

## Website And Performance Strategy

The website should be generated from the repository contents at build time. The first version should avoid a runtime database and should emit static pages and indexes wherever possible.

Performance requirements:

- precompute work pages, author pages, collection pages, language pages, and primary catalog pages
- precompute search artifacts or compact indexes at build time
- support long works through split chapter files for predictable generation and caching
- support bilingual and multilingual rendering through sibling translation trees under each work
- keep route generation deterministic from IDs and slugs
- favor CDN-cacheable output and minimal client-side JavaScript for reading pages

If the project later needs more advanced search or analytics, those can be added as secondary services without changing the canonical source model.

## Governance And Moderation

The repository is open to public contribution but not open publication. Contributors may submit:

- full texts
- metadata changes
- translations
- annotations

Submission does not imply publication. Publication requires explicit approval and merge by Ebenezer Ajaero or approved maintainers and reviewers acting under the project governance model.

Initial merge authority:

- Ebenezer Ajaero
- approved maintainers
- approved reviewers with merge permission as designated by the project

Content moderation principles:

- every published work must have explicit provenance
- every published work must have a documented rights basis
- unverified copyright status blocks publication
- private or internal records are never acceptable as public source material

## Git And GitHub Process

Default branch:

- `main`

Branch naming:

- `feat/...` for website features
- `content/...` for works, translations, and corpus changes
- `docs/...` for governance and documentation updates
- `fix/...` for corrections

Protected-branch policy for `main`:

- no direct pushes
- pull requests required for all changes
- passing checks required before merge
- CODEOWNERS-based review requests enabled

Review policy:

- at least 1 approval for ordinary code and docs changes
- at least 2 approvals for new full-text works or any rights-status change
- sensitive content paths owned by you plus approved maintainers in `CODEOWNERS`

Required checks:

- front matter and schema validation
- link and reference validation
- provenance and rights field validation
- website build verification
- lint and formatting checks

## Legal And Rights Framework

Every work must declare a rights status and basis. Acceptable examples include:

- `public_domain`
- `cc_by`
- `cc_by_sa`
- `other_free_culture`
- `open_source_text`

The project must treat rights review as mandatory. A contributor assertion that material is free to publish is not sufficient by itself. `sources.md` must capture:

- source origin
- edition details
- rights reasoning
- verification notes
- transformation notes for OCR, cleanup, or translation work

## AI Contribution Rules

The repository will use AI-assisted workflows, so it needs an explicit `AGENTS.md` with constraints. That file should require:

- no private data in prompts, commits, or generated files
- no invented provenance, rights reasoning, or bibliographic data
- no bulk ingestion without explicit verification
- no copyrighted text unless the rights basis is documented and approved
- content and metadata changes to preserve the canonical schema
- public-facing outputs to remain consistent with repository policies

## Privacy And Public Safety Requirements

The repository must be safe to open-source. The following should be excluded from canonical source control:

- `.obsidian/`
- private note exports
- unpublished internal planning notes
- personal environment files
- temporary ingestion or scraping dumps unless curated into approved public content
- private imports and review materials

This project should rely only on public, publishable material in the repository itself.

## Git Ignore Policy

The `.gitignore` should ignore:

- app build artifacts
- package manager caches
- logs
- local environment files
- editor junk
- temporary directories
- private imports

The `.gitignore` should not ignore:

- canonical content under `library/`
- public assets required for published works
- governance and policy documents

The `.gitignore` should explicitly block likely private or local-only material such as:

```gitignore
.obsidian/
.DS_Store
node_modules/
.env
.env.*
dist/
build/
.next/
coverage/
tmp/
imports/private/
*.log
```

## Initial Deliverables For Repository Setup

When implementation begins, the initial repository setup should create:

- public GitHub repository named `civilisation`
- local git repository and remote origin
- baseline website scaffold under `apps/web/`
- canonical `library/` structure with sample records
- `README.md`
- `AGENTS.md`
- `.gitignore`
- `CODEOWNERS`
- contribution and provenance policy documents
- branch protection and review rules on GitHub

## Open Design Decisions Deferred To Implementation Planning

These are valid follow-on planning items, not blockers for the design:

- exact web framework for `apps/web/`
- exact static search implementation
- schema validation tool choice
- GitHub Actions workflow details
- contributor license or DCO policy
- moderation escalation process for disputed rights claims

## Recommendation

Proceed with a static-first monorepo where the public website and canonical library live together. Use per-work folders in Markdown with YAML front matter, stable linkable records, and strict provenance and review gates. Keep the initial architecture operationally simple, legally conservative, and optimized for fast static delivery.
