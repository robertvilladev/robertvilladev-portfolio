# 010 · Printable CV page

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 2 · Real content | Content & data | H | S | none |

**Depends on:** —

## Why
A PDF goes stale. A `/cv` page generated from `career.ts` and the projects is always current, in three languages, and prints to a clean PDF.

## Scope
**In**
- `/cv`, `/es/cv`, `/ca/cv`: experience, skills, selected projects, contact
- Print stylesheet: light, single column, no animations, page breaks
- Optional: build-time PDF export

**Out**
- Editing the CV in the browser

## Approach
`pages/[...lang]/cv.astro` reading `data/career.ts` and the projects collection. `@media print` styles. Link from Contact replaces `site.cvUrl`.

## Guardrails
No JS. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Include education or certifications (none on LinkedIn today)?
- Generate the PDF at build time (Playwright print) or let visitors print?

## Done when
- [ ] Printing /cv to PDF gives a tidy 1–2 page CV in each language
