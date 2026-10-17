# 006 · Generated share images

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 1 · Signature | SEO & sharing | M | M | none |

**Depends on:** [005](005-structured-data.md)

## Why
Links shared on LinkedIn, WhatsApp or Slack currently show no image. A terminal-styled card per page makes every share look intentional.

## Scope
**In**
- 1200×630 PNG per page per locale, terminal-window styled, palette from tokens
  - Home: `~ $ whoami`, name, role, a few stack tags (localized)
  - Project: `~ $ cat <slug>`, title, summary, stack tags (localized)
  - 404 reuses the home (EN) card
- `og:image` (+ width/height/alt) and `twitter:card=summary_large_image` in `Base.astro`, pages pass their image path

**Out**
- Dynamic images at request time (the site is static)

## Approach
Build-time endpoint `src/pages/og/[...path].png.ts` using `satori` + `@resvg/resvg-js`, emitting `/og/<lang>/home.png` and `/og/<lang>/<slug>.png`. Paths come from `langs` and `projectPaths()`. All devDependencies, nothing shipped to the browser.

Fonts: satori can't read woff2, so the static `@fontsource/jetbrains-mono` and `@fontsource/space-grotesk` (woff, same families the site bundles) are loaded from `node_modules`.

## Guardrails
Build time: cache or keep the image count small (21 today). Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Decisions
- Home gets its own card (`whoami`); projects share one layout (`cat <slug>`).

## Done when
- [x] `npm run build` emits a PNG per page and locale (21 images, ~2 s total)
- [x] Every page's `og:image` points at an existing 1200×630 file (asserted in `tests/seo.spec.ts`)
- [ ] Checked with a social preview tool (needs the deployed URL; left to the owner)
