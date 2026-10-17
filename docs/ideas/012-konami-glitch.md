# 012 · Konami glitch mode

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 3 · Delight | Delight | M | S | none |

**Depends on:** —

## Why
A classic easter egg that fits the cyberpunk side of the design and rewards curious visitors.

## Scope
**In**
- ↑↑↓↓←→←→BA triggers ~5 s of glitch: RGB split on headings, heavier scanlines, binary burst
- Also reachable from the terminal (`glitch`) once 007 lands

**Out**
- Anything that persists after the effect ends

## Approach
Tiny key-sequence listener in `scripts/`; the effect is a `data-glitch` attribute on `<html>` driving CSS animations. Reuses the sparkle layer for the burst.

## Guardrails
Reduced motion: show a static message instead. No flashing faster than 3 Hz (photosensitivity). Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- None yet.

## Done when
- [ ] Sequence triggers the effect; it cleans up fully; safe for photosensitive users
