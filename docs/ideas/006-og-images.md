# 006 · Generated share images

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 1 · Signature | SEO & sharing | M | M | none |

**Depends on:** [005](005-structured-data.md)

## Why
Links shared on LinkedIn, WhatsApp or Slack currently show no image. A terminal-styled card per page makes every share look intentional.

## Scope
**In**
- 1200×630 PNG per page per locale: terminal window with `~ $ cat <project>`, title, stack tags, palette from tokens
- `og:image` + `twitter:card=summary_large_image`

**Out**
- Dynamic images at request time (the site is static)

## Approach
Build-time endpoint `src/pages/og/[...path].png.ts` using `satori` + `@resvg/resvg-js` with the bundled fonts. Build-only dependencies, nothing shipped to the browser.

## Guardrails
Build time: cache or keep the image count small (21 today). Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Same layout for home and projects, or a special one for home?

## Done when
- [ ] Every page has a correct og:image, checked with a social preview tool
