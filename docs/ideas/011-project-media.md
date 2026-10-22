# 011 · Project media

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 2 · Real content | Content & data | H | M | low |

**Depends on:** [001](001-content-gaps.md)

## Why
Cards and detail pages show placeholder boxes. Real visuals are the biggest jump in perceived quality.

## Scope
**In**
- Optional `cover` (image) and `loop` (short muted video) in the project schema
- Screens shown inside the terminal window frame with a scanline overlay
- Detail page gallery

**Out**
- A CMS

## Approach
Images via `astro:assets` `<Picture>` (AVIF/WebP, sized). Video as `<video muted playsinline loop preload="none">`, started by IntersectionObserver, poster image first.

## Guardrails
Lazy below the fold, explicit dimensions (CLS 0), no autoplay under reduced motion. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Screenshots only, or short loops for games (chloropunk, sudoku)?

## Done when
- [ ] Every project has a cover; Lighthouse performance stays ≥ 95
