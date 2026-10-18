# 008 · Page transitions

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 1 · Signature | Interaction | H | S | low |

**Depends on:** —

## Why
Opening a project currently does a full page swap. A morph from card to window continues the "zoom into the terminal" story across pages.

## Scope
**In**
- Project card window morphs into the detail window and back
- Language switch and theme stay smooth across navigation

**Out**
- Transitions on external links

## Approach
CSS cross-document view transitions, no router and no new dependency.

- `global.css`: `@view-transition { navigation: auto; }` inside `@media (prefers-reduced-motion: no-preference)`. Reduced motion, and browsers without support (Firefox), navigate normally. Every internal navigation gets a ~200 ms root crossfade; the header and `Background` have their own `view-transition-name`, so they stay in place.
- Morph pairs, three names per project derived from the slug: card frame `.card` ↔ detail Terminal window, card `h3` ↔ detail `h1`, `.card__shot` ↔ detail `.shot`. ~450 ms with `--ease-out`. No GSAP tween ever touches these properties.
- The detail page carries its three names statically. On home, names live on **one** card at a time (never six, duplicates cancel the transition). A tiny inline `<head>` script (<1 KB, no imports) sets them: on `pageswap` when the destination is a project page, and on `pagereveal` when `navigation.activation.from` is a project page. It flags the morph target with `data-vt` and clears the names when the transition finishes.
- `zoomOpen()` in `motion.ts` skips `[data-vt]` elements, so the target is never hidden after the snapshot. The inline `<head>` script runs before the deferred `motion.ts`, but `pagereveal` can fire after it, so the script also reads `navigation.activation` at parse time and sets `<html data-vt="<slug>">`; `zoomOpen()` skips `#p-<slug>` (the detail window carries the same id).
- Each card `li` gets `id="p-<slug>"`; the detail "< back" link goes to `<home>#p-<slug>` so home lands on that card and the window morphs back. Browser Back does the same. Check the anchor against the pinned hero and Lenis.
- The 007 terminal `<dialog>` gets its own name with its group hidden, so it is neither captured into the root nor ghosted.
- Tests: Playwright (shared names, uniqueness, target visible after "< back" and browser Back, no transition under reduced motion, axe). Manual: language switch, theme toggle, 375 px, terminal open during navigation. Safari 18.2+ is a manual check.

## Guardrails
Disable under reduced motion. Only the inline script is added as JS: first-paint budget and CLS must not change. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Resolved questions
- **CSS-only cross-document transitions, or Astro `<ClientRouter />`?** CSS-only. No script re-init of GSAP/Lenis, no router, zero extra JS beyond the inline script.

## Done when
- [x] Card → detail → back morphs in Chromium (Safari 18.2+ to be checked by hand), normal navigation elsewhere and under reduced motion
