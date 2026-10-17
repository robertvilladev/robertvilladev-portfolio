# 003 · Quality gates

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 0 · Ship it | Foundation | H | M | none |

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
- **Lighthouse CI**: `@lhci/cli` with `lighthouserc.json`, `staticDistDir: dist`, home + one project page, mobile preset, 3 runs. Assertions (error level): Performance ≥ 0.95, Accessibility ≥ 0.95, SEO = 1, CLS ≤ 0.001 (what Lighthouse displays as 0; the font swap still nudges glyph widths by ~0.0002). Locally set `CHROME_PATH` if no Chrome is installed (Playwright's Chromium works).
- **Scripts**: `npm run test:e2e`, `npm run check:size`, `npm run lhci`, and `npm run quality` running all three after a build.
- axe runs with reduced motion so it scans the settled page (mid-animation opacity made contrast results flaky).
- **CI**: `.github/workflows/quality.yml` (separate from 002's `ci.yml`): build once, then size check, Playwright, LHCI. On PRs, LHCI runs against the Vercel preview: Vercel posts only a `Vercel` commit status (no GitHub deployments), so the job polls that status for the head SHA, takes the preview URL from the Vercel bot comment, and sends the `VERCEL_AUTOMATION_BYPASS_SECRET` repo secret as `x-vercel-protection-bypass` (previews sit behind Vercel Authentication). Previews are served with `X-Robots-Tag: noindex`, so `is-crawlable` is skipped there. Pushes to `main` keep the `dist/` run, which still checks crawlability.

## What the gates found (fixed while building)
- Light theme: `--accent` `#00806f` → `#00766a` and `--hash` `#9a6a00` → `#8f6200`, both were just under 4.5:1.
- Footer easter egg was at 45% opacity (2:1 contrast); now full muted color.
- Theme button and project cards had `aria-label`s that hid their visible text from voice control; removed (button keeps the hint as `title`), `projects.open` string dropped.
- Prose links on project pages are underlined (were color-only).
- Mobile header re-wrapped to two rows when the web font loaded (CLS 0.145, Perf 94); on ≤720px the right-hand nav now always takes its own row.

## Done when
- [x] CI fails when a locale page is missing, overflow appears, or the budget is exceeded
- [x] Reduced-motion and axe checks pass on the current site
- [x] Each check shown failing when broken on purpose
- [x] Lighthouse runs against the Vercel preview
