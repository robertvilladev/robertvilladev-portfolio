# 004 · Terminal 404 page

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 0 · Ship it | Delight | M | S | none |

**Depends on:** —

## Why
Cheap, on-theme, and the one page every site needs anyway.

## Scope
**In**
- `zsh: command not found: /the-path` styled in the Terminal component
- Suggestions: `cd ~` (home), `ls projects`
- Localized: one 404 per locale or language detected from the path prefix

**Out**
- Fuzzy "did you mean" matching (add if 404s show up in analytics)

## Approach
`src/pages/404.astro` using `Base` + `ui/Terminal`. Astro emits `404.html`, which Vercel serves automatically. Strings are keyed `404.*` in `src/i18n/ui.ts` for every locale. The page renders EN; a small inline script (~1 KB, no dependencies) reads `location.pathname`, picks the locale from a `/es/` or `/ca/` prefix, swaps the text and link hrefs, sets `<html lang>`, and fills in the requested path. The script reads the strings from a JSON blob embedded in the page.

## Guardrails
Works without JS (falls back to EN, shows `/<path>` placeholder-free). Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- ~~One 404 in EN, or pick the locale from the URL prefix?~~ Resolved: one static `404.html` in EN, locale picked from the URL prefix by a tiny inline script. Without JS it stays EN. The requested path also needs that script, since the page is static.

## Done when
- [ ] Unknown URLs show the terminal 404 with working links home
