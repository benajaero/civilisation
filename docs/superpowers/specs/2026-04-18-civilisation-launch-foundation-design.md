# Library of Civilisation Launch Foundation Design

## Summary

This design revises the initial Library of Civilisation direction into a narrower, brand-first launch foundation. The immediate objective is not to build the full library product in one pass, but to establish a disciplined repository, an explicit launch brand system under `packages/`, and a branded web shell that expresses the intended posture of the project before broader catalog and reading surfaces are implemented.

The design is anchored in the existing `https://www.ninthheaven.co/civilisation/` page as a thematic predecessor, but not as a product template. That predecessor has the right moral and editorial tone, yet it still behaves like a journal landing page. The launch foundation should instead feel austere, archival, editorial, and minimalist, with stronger typographic hierarchy, clearer institutional framing, and less promotional clutter.

## Goals

- Establish a one-to-one implementation sequence that can be executed cleanly without mixing too many subsystems at once.
- Make branding first-class architecture by defining a canonical launch brand system in `packages/brand`.
- Build a web shell in `apps/web` that consumes the brand package rather than creating a second visual system locally.
- Preserve the broader library vision while intentionally limiting the first execution plan to foundation work.
- Ensure the repo structure and documentation support later expansion into catalog, work, author, and collection surfaces without revisiting core brand decisions.

## Non-Goals

- Building the full catalog, work, author, and collection experience in the first implementation plan.
- Finalizing citation, footnote, chapter-opening, or archival document presentation rules beyond what launch primitives need.
- Implementing full content ingestion, search, multilingual rendering, or contributor submission workflows in the first branded foundation plan.
- Recreating the prior `ninthheaven.co/civilisation` landing page structure with generic promotional sections and repeated call-to-action patterns.

## Design Direction

The launch experience should be austere, archival, editorial, and minimalist.

This means:

- restrained, paper-like or mineral-toned surfaces rather than bright interface color
- ink-forward typography with strong hierarchy and disciplined contrast
- sparse use of accent color
- thin rules, deliberate spacing, and clear structural rhythm
- limited motion, used only where it supports reading or orientation
- homepage composition that feels like an institutional threshold or frontispiece, not a marketing homepage

The intended atmosphere is not luxurious, playful, or startup-clean. It should feel like a serious public archive shaped by editorial judgment.

## Brand Reference Interpretation

The design should borrow tone from the broader Ninth Heaven ecosystem while becoming more archival than the existing properties.

- `www.ninthheaven.co` contributes the editorial and literary posture.
- `group.ninthheaven.co` contributes institutional discipline and seriousness.
- The previous `www.ninthheaven.co/civilisation/` page contributes thematic language and purpose, but not its page architecture.

The new direction should be more severe, more ordered, and less magazine-like than all of these references.

## Repository Architecture

The repo should remain monorepo-shaped, with launch work centered on a small number of clearly bounded areas:

```text
civilisation/
  apps/
    web/
  packages/
    brand/
  library/
  docs/
    policies/
    architecture/
    superpowers/
      specs/
      plans/
  .github/
```

Responsibilities:

- `apps/web/` holds the website application and composes the launch shell from the brand package.
- `packages/brand/` is the canonical source for launch brand primitives and documentation.
- `library/` remains reserved for canonical content records and later content-system work.
- `docs/` holds governance, architecture, and planning records.

## Launch Sequence

Implementation should proceed in a one-to-one sequence:

1. monorepo and repository governance bootstrap
2. `packages/brand` foundation and documentation
3. branded core shell in `apps/web`
4. canonical content model and sample records
5. content ingestion and validation
6. later library surfaces and richer product features

This order is intentional. The launch brand system defines the visual and editorial posture of the shell. The shell should exist before content-heavy product surfaces so that later page systems inherit coherent primitives instead of forcing retroactive design extraction.

## Brand System Scope

The canonical launch brand system must live in `packages/brand`.

It should cover launch primitives only, not the full eventual reading-system ruleset. The package should contain explicit, versioned foundations for:

- color tokens
- typography tokens and scale
- spacing rhythm
- border, rule, and radius values
- depth and surface behavior
- motion constraints
- theme assembly
- launch-ready global styles or exported CSS layers
- shell-level primitives where they are necessary to express the system

Recommended internal structure:

```text
packages/brand/
  src/
    tokens/
    themes/
    styles/
    components/
  docs/
```

The package documentation should also define launch brand guidance in prose:

- voice and tone
- naming posture
- heading and display-text behavior
- metadata presentation posture
- image and illustration constraints
- interaction principles
- explicit "do" and "do not" examples

## Core Shell Scope

The first branded implementation in `apps/web` should cover only the core shell and a homepage proving ground.

Included scope:

- global layout frame
- header and footer
- navigation posture
- page container system
- global typographic defaults
- a small set of shell-level section patterns
- a homepage that demonstrates the shell and brand direction

Excluded scope:

- catalog and faceted browsing
- work pages
- author pages
- collection pages
- advanced search
- multilingual presentation systems beyond future-ready scaffolding

The homepage should act as a threshold to the archive. It should present the title, framing statement, and measured entry points with institutional restraint. It should not behave like a dense marketing page or a stack of interchangeable content cards.

## Dependency Rule

`apps/web` must consume launch presentation primitives from `packages/brand` rather than creating an independent visual layer. Local app styling may compose the brand system, but it should not redefine tokens or invent a second competing set of foundations.

This rule is important because the long-term library will add new surfaces gradually. Keeping brand authority inside `packages/brand` makes those later expansions more predictable and avoids style drift.

## Planning Boundary

The next implementation plan should stay narrow and execution-ready.

Included in the next plan:

- repo bootstrap and governance essentials
- creation of `packages/brand`
- documentation of the explicit launch brand system
- scaffolding of `apps/web`
- implementation of the branded core shell
- a homepage proof that demonstrates the shell
- tests and validation needed to keep that foundation stable

Explicitly excluded from the next plan:

- full catalog and reading surfaces
- advanced content ingestion pipelines
- search implementation
- full multilingual support
- contributor submission workflows beyond governance docs and repo rules

## Success Criteria

The launch foundation work is successful when:

- the repo has a stable monorepo and governance baseline
- `packages/brand` is the clear canonical source of launch brand primitives
- `apps/web` visibly reflects the austere, archival, editorial, minimalist direction
- the homepage feels like the threshold to a serious archive rather than a generic journal landing page
- later plans can extend into content and product surfaces without reopening core brand questions

## Risks And Mitigations

### Risk: Brand system becomes vague documentation instead of usable infrastructure

Mitigation: require `packages/brand` to ship both machine-consumable primitives and prose guidance, with the web shell consuming those primitives immediately.

### Risk: The shell inherits generic defaults from modern web starter patterns

Mitigation: make the shell dependent on `packages/brand` from the start and keep launch scope narrow enough to refine the posture before catalog complexity arrives.

### Risk: The plan becomes monolithic again

Mitigation: keep the next implementation plan strictly limited to foundation work and defer content-heavy product surfaces to later plans.

## Open Future Work

The following areas are intentionally deferred but anticipated by this design:

- canonical content schema and validation
- work, author, and collection templates
- reading layouts
- citation and annotation treatments
- catalog browsing and indexing
- multilingual rendering systems
- submission and editorial workflow automation

These should be planned after the brand-first foundation is implemented and validated.
