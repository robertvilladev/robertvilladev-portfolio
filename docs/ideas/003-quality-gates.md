# 003 · Quality gates

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 0 · Ship it | Foundation | H | M | none |

**Depends on:** [002](002-deploy-and-ci.md)

## Why
The site is about motion, which is exactly what regresses silently: a heavier bundle, a broken reduced-motion path, horizontal overflow on phones. Automated checks keep every later feature honest.

## Scope
**In**
- Playwright smoke tests: every route in every locale returns 200 and has the right `<html lang>`; no horizontal overflow at 375px; with reduced motion, all sections are visible
- axe accessibility scan on home and one project page
- Lighthouse CI with the budget from ARCHITECTURE.md
- JS size check against the 60 KB budget

**Out**
- Visual regression screenshots (add if layout bugs slip through)

## Approach
`@playwright/test` + `@axe-core/playwright` as dev deps, `tests/smoke.spec.ts`. Lighthouse CI via `treosh/lighthouse-ci-action` against the Vercel preview.

## Guardrails
Tests run against the built site (`astro preview`), not the dev server. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Fail the PR on budget breach, or warn only at first?

## Done when
- [ ] CI fails when a locale page is missing, overflow appears, or the budget is exceeded
