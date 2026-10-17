# 016 · Pixel cursor trail

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 3 · Delight | Delight | L | S | low |

**Depends on:** —

## Why
A small pixel square that follows the pointer with a grid snap adds texture on desktop.

## Scope
**In**
- Trail of 3–4 squares snapping to an 8px grid, accent colored
- Grows over links and buttons

**Out**
- Touch devices; replacing the system cursor

## Approach
One `requestAnimationFrame` loop that runs only while the pointer moves (`pointermove` wakes it, idle stops it). Enabled with `(pointer: fine) and (prefers-reduced-motion: no-preference)`.

## Guardrails
No loop while idle or hidden; `transform` only. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Worth it next to the click sparkle, or is that already enough?

## Done when
- [ ] No measurable main-thread cost when the mouse is still
