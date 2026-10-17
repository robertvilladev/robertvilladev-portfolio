# 018 · Notes: how things work

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 4 · Depth | Content & data | H | M | none |

**Depends on:** [005](005-structured-data.md)

## Why
The site's theme is 'I build things to understand how they work'. Short write-ups of what each side project taught are great for SEO and show depth beyond code.

## Scope
**In**
- `notes` content collection (MDX), per language where translated
- `~ $ cat notes/` index + note pages, RSS feed
- Code blocks with the terminal style

**Out**
- Comments, newsletter

## Approach
Second collection in `content.config.ts`, pages under `pages/[...lang]/notes/`, `@astrojs/rss`. Shiki (built into Astro) for code.

## Guardrails
No client JS on note pages except shared motion. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Publish in English only, or translate?
- First topics: the 13 sudoku techniques? ECS in veggie-vendetta?

## Done when
- [ ] First note published with RSS
