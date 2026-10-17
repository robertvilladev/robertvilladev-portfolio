# 003 · Quality gates

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 0 · Ship it | Foundation | H | M | none |

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
Every budget **fails** the PR from day one (decided: the site sits at ~49 KB JS, so there is headroom, and a warning nobody reads is no gate).

- **Playwright** (`@playwright/test`, `@axe-core/playwright` dev deps), config in `playwright.config.ts`, tests in `tests/`. `webServer` runs `astro preview` on the already-built `dist/`, never the dev server. Chromium only.
  - Routes come from the build output: every `dist/**/index.html` becomes a URL, and its locale is the first path segment if it is a key of `languages` in `src/i18n/ui.ts`, else `defaultLang`. A missing locale or project page means a missing file, which fails the per-locale count check (each locale has the same number of pages as the default one).
  - Per route: 200 and `<html lang>` matches.
  - At 375px: `scrollWidth <= innerWidth` on every route.
  - With `reducedMotion: 'reduce'`: `#about`, `#projects`, `#log`, `#contact` are visible (opacity > 0, not hidden) in every locale's home.
  - axe on home and the first project page: no `serious` or `critical` violations.
- **JS size**: `scripts/check-js-size.mjs` gzips every `.js` in `dist/_astro` with `node:zlib` and fails above 60 KB total. Total is a conservative stand-in for "JS on first paint" (everything there loads on the home page today); split it per-entry once 007/008 add dynamic imports.
- **Lighthouse CI**: `@lhci/cli` with `lighthouserc.json`, `staticDistDir: dist`, home + one project page, mobile preset, 3 runs. Assertions (error level): Performance ≥ 0.95, Accessibility ≥ 0.95, SEO = 1, CLS = 0.
- **Scripts**: `npm run test:e2e`, `npm run check:size`, `npm run lhci`, and `npm run quality` running all three after a build.
- **CI**: `.github/workflows/quality.yml` (separate from 002's `ci.yml`): build once, then size check, Playwright, LHCI. LHCI runs against `dist/` for now; pointing it at the Vercel preview URL waits on 002.

## Done when
- [ ] CI fails when a locale page is missing, overflow appears, or the budget is exceeded
- [ ] Reduced-motion and axe checks pass on the current site
- [ ] Each check shown failing when broken on purpose
- [ ] Lighthouse runs against the Vercel preview (waits on 002)
