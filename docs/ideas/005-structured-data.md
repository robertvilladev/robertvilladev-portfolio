# 005 · Structured data and SEO basics

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 1 · Signature | SEO & sharing | M | S | none |

**Depends on:** —

## Why
Lets search engines connect the site, GitHub and LinkedIn as one person, and rank project pages as software.

## Scope
**In**
- JSON-LD `Person` with `sameAs` [GitHub, LinkedIn], `jobTitle`, `knowsLanguage` [en, es, ca]
- JSON-LD `SoftwareSourceCode` on each project page (repo, language, description)
- `robots.txt` pointing at the sitemap
- Check titles and descriptions per locale

**Out**
- Paid SEO tooling

## Approach
A `jsonLd` prop on `Base.astro` rendered as `<script type="application/ld+json">`. Data comes from `config.ts` and the project entry.

## Guardrails
Zero runtime JS (JSON-LD is inert). Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- None yet.

## Done when
- [ ] Google Rich Results test passes for home and one project page
