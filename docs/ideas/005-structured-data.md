# 005 · Structured data and SEO basics

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 1 · Signature | SEO & sharing | M | S | none |

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
- Public email in `Person`? Yes, `config.ts` `email` only (the public one).
- `knowsLanguage` source? Read `langs` from `i18n/ui.ts`, never hard-coded.
- Author link? Person gets a stable `@id` (`<site>/#person`); project pages reference it instead of repeating the Person.
- `robots.txt`? Static `public/robots.txt`. `@astrojs/sitemap` emits `sitemap-index.xml`; the layout already links it.
- Titles and descriptions? Audit by test: every page has one, unique within its locale; home differs per locale. 404 keeps the default description.

## Done when
- [ ] JSON-LD parses and has the required fields on home (each locale) and project pages (tested in `tests/seo.spec.ts`)
- [ ] `robots.txt` points at the sitemap
- [ ] Titles and descriptions present and unique per locale (tested)
- [ ] Google Rich Results test passes for home and one project page (run against the Vercel preview)
