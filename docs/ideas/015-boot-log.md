# 015 · First-visit boot log

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 3 · Delight | Delight | M | S | low |

**Depends on:** —

## Why
A short BIOS-style intro sets the tone, once.

## Scope
**In**
- About 1.5 s of fast scrolling boot lines before the hero types
- First visit only, skippable with any key, click or scroll

**Out**
- Repeat visits; anything longer than 2 s

## Approach
Inline CSS-only overlay in `Base.astro`, removed by a few lines of inline JS. Shown only when `localStorage` has no flag.

## Guardrails
Must not delay LCP: the hero renders underneath; skipped entirely under reduced motion. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Does it fight with the hero typing? Maybe the boot log *is* the hero typing on the first visit.

## Done when
- [ ] LCP unchanged in Lighthouse; shown once; instantly skippable
