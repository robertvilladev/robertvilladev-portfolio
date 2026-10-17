# 001 · Content gaps

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 0 · Ship it | Foundation | H | S | none |

**Depends on:** —

## Why
The site is only as convincing as its content. A few placeholders remain, and two project descriptions are partly guessed.

## Scope
**In**
- CV: either a PDF in `public/` + `site.cvUrl`, or skip it in favour of [010](010-cv-page.md)
- Raw screenshots or short screen recordings for each project (feeds [011](011-project-media.md))
- Confirm or rewrite the loldle-ai-api and omdb-explorer descriptions (EN/ES/CA)
- Gotdle: update the description once the Vue app has real game screens

**Out**
- Building the media pipeline (that is 011)

## Approach
Content-only changes in `src/content/projects/*` and `src/config.ts`. No code.

## Guardrails
None beyond the content schema. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- PDF CV, generated /cv page, or both?
- Which projects get a live demo link?

## Done when
- [ ] No `[placeholder]` text left in any locale
- [ ] Every project description confirmed by Robert
