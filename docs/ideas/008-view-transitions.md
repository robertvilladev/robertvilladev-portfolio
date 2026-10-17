# 008 · Page transitions

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 1 · Signature | Interaction | H | S | low |

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
Cross-document View Transitions (`@view-transition { navigation: auto; }`) + matching `view-transition-name` per project. No JS router. Browsers without support just navigate normally.

## Guardrails
Disable under reduced motion. Check that GSAP/Lenis re-init cleanly if Astro `<ClientRouter />` is ever adopted instead. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- CSS-only cross-document transitions, or Astro `<ClientRouter />` (needs script re-init)?

## Done when
- [ ] Card → detail → back morphs in Chromium and Safari, normal navigation elsewhere
