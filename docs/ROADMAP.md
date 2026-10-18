# Roadmap

Every planned feature, in build order. Each row links to its spec in [ideas/](ideas/); refine the spec on its own branch before building it (see [README.md](README.md)).

**How it's ordered:** phases go from "needed to launch" to "nice to have". Inside a phase, items are independent unless *Depends on* says otherwise, so they can be built in parallel.

**Keys:** Impact and Effort are H/M/L and S/M/L. *Perf* is the runtime cost a visitor pays: `none` means build time only, `low` means loaded on demand and within the budget in [ARCHITECTURE.md](ARCHITECTURE.md).

**Phases:** 0 · Ship it — live, tested, no placeholders. 1 · Signature — the features that make the site memorable. 2 · Real content — data and media that replace placeholders. 3 · Delight — easter eggs and polish. 4 · Depth — bigger builds that show skill.

## Phase 0 · Ship it

| # | Item | Category | Impact | Effort | Perf | Depends on | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | [Content gaps](ideas/001-content-gaps.md) | Foundation | H | S | none | — | idea |
| 002 | [Deploy and CI](ideas/002-deploy-and-ci.md) | Foundation | H | S | none | — | done |
| 003 | [Quality gates](ideas/003-quality-gates.md) | Foundation | H | M | none | [002](ideas/002-deploy-and-ci.md) | done |
| 004 | [Terminal 404 page](ideas/004-terminal-404.md) | Delight | M | S | none | — | done |

## Phase 1 · Signature

| # | Item | Category | Impact | Effort | Perf | Depends on | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 005 | [Structured data and SEO basics](ideas/005-structured-data.md) | SEO & sharing | M | S | none | — | done |
| 006 | [Generated share images](ideas/006-og-images.md) | SEO & sharing | M | M | none | [005](ideas/005-structured-data.md) | done |
| 007 | [Interactive terminal](ideas/007-interactive-terminal.md) | Interaction | H | M | low | — | done |
| 008 | [Page transitions](ideas/008-view-transitions.md) | Interaction | H | S | low | — | done |

## Phase 2 · Real content

| # | Item | Category | Impact | Effort | Perf | Depends on | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 009 | [GitHub data at build time](ideas/009-github-live-data.md) | Content & data | M | S | none | [002](ideas/002-deploy-and-ci.md) | done |
| 010 | [Printable CV page](ideas/010-cv-page.md) | Content & data | H | S | none | — | idea |
| 011 | [Project media](ideas/011-project-media.md) | Content & data | H | M | low | [001](ideas/001-content-gaps.md) | idea |

## Phase 3 · Delight

| # | Item | Category | Impact | Effort | Perf | Depends on | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 012 | [Konami glitch mode](ideas/012-konami-glitch.md) | Delight | M | S | none | — | done |
| 013 | [Achievements](ideas/013-achievements.md) | Delight | M | S | none | [007](ideas/007-interactive-terminal.md), [012](ideas/012-konami-glitch.md) | idea |
| 014 | [Theme variants](ideas/014-theme-variants.md) | Delight | M | S | none | [007](ideas/007-interactive-terminal.md) | done |
| 015 | [First-visit boot log](ideas/015-boot-log.md) | Delight | M | S | low | — | done |
| 016 | [Pixel cursor trail](ideas/016-pixel-cursor.md) | Delight | L | S | low | — | done |

## Phase 4 · Depth

| # | Item | Category | Impact | Effort | Perf | Depends on | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 017 | [Playable sudoku demo](ideas/017-playable-sudoku.md) | Interaction | H | L | low | [011](ideas/011-project-media.md) | idea |
| 018 | [Notes: how things work](ideas/018-notes.md) | Content & data | H | M | none | [005](ideas/005-structured-data.md) | done |
| 019 | [Privacy-friendly analytics](ideas/019-privacy-analytics.md) | Foundation | M | S | low | [002](ideas/002-deploy-and-ci.md) | idea |
