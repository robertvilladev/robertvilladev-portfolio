# 004 · Terminal 404 page

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 0 · Ship it | Delight | M | S | none |

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
`src/pages/404.astro` using `Base` + `ui/Terminal`. Astro emits `404.html`, which Vercel serves automatically.

## Guardrails
No JS needed. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- One 404 in EN, or pick the locale from the URL prefix with a tiny inline script?

## Done when
- [ ] Unknown URLs show the terminal 404 with working links home
