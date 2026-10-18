# 018 · Notes: how things work

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 4 · Depth | Content & data | H | M | none |

**Depends on:** [005](005-structured-data.md)

## Why
The site's theme is 'I build things to understand how they work'. Short write-ups of what each side project taught are great for SEO and show depth beyond code.

## Scope
**In**
- `notes` content collection (MDX), translated into every locale
- `~ $ cat notes/` index + note pages, one RSS feed per locale
- Code blocks with the terminal style
- First note: "What makes a sudoku hard?" (sudoku-2077)

**Out**
- Comments, newsletter

## Decisions
- **Translated.** Every note exists in en, es and ca with the same slug, like projects. `src/content/notes.test.ts` fails if a slug is missing in any locale.
- **Collection.** `notes` in `content.config.ts`, MDX via `@astrojs/mdx`, at `src/content/notes/<lang>/<slug>.mdx`. Schema: `title`, `summary`, `date`, `updated?`, `tags[]`, `project?` (a project slug), `draft` (default false). Helpers in `lib/notes.ts`, mirroring `lib/projects.ts`.
- **Pages.**
  - `/[...lang]/notes/`: a `~ $ cat notes/` index with date, title and summary, newest first.
  - `/[...lang]/notes/<slug>/`: the article.
  - Code blocks: Shiki's `css-variables` theme, its `--astro-code-*` variables mapped to the design tokens in `global.css`, so code follows all six themes. Each `<pre>` gets terminal chrome (bar and dots) from CSS only.
  - Prose is readable at 375 px: long code scrolls inside its block, never the page. No new client JS.
- **Wiring.**
  - A `./notes` nav link (es `./notas`, ca `./notes`). The header still fits at 375 px: like the other nav links it's hidden on phones, so the footer links to the notes too.
  - RSS through `@astrojs/rss`: `/rss.xml`, `/es/rss.xml`, `/ca/rss.xml`, each linked from `<head>` with `rel="alternate" type="application/rss+xml"`.
  - JSON-LD `TechArticle` whose `author` is the Person `@id` (005).
  - A per-note OG card from the existing og route (006).
  - hreflang alternates come from Base.astro, as on every page. The sitemap picks the pages up on its own.
  - A project page links to every note whose `project` is its slug.
- **Terminal.** A `notes/` directory with one file per note (title and summary only). `cat notes/<slug>` prints the summary and a link to the note page. Stays inside the lazy terminal budget.
- **First topic.** Sudoku difficulty grading, from the public sudoku-2077 repo: graded by the techniques a puzzle needs, not by its givens. ECS in veggie-vendetta can come later.
- **Voice.** First person, plain words, the way the landing copy (020) talks. Terminal flavor only in microcopy.

## Guardrails
No client JS on note pages except shared motion. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Done when
- [x] Notes collection with a test that every note exists in every locale
- [x] Index and note pages in every locale, readable at 375 px, code blocks follow every theme
- [x] `./notes` nav link; header fits at 375 px
- [x] RSS feed per locale, linked from `<head>`
- [x] `TechArticle` JSON-LD, OG card and hreflang on note pages
- [x] sudoku-2077's project page links to the note
- [x] `notes/` in the terminal; `cat notes/<slug>` links to the note; lazy budget holds
- [x] First note published in en, es and ca
- [x] e2e tests cover the above
