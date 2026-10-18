# Architecture

Astro 7 static site. Zero JS by default; one bundled script per page for motion. GSAP + ScrollTrigger for scroll animation, Lenis for smooth scroll.

## Layout

```
src/
  config.ts                 personal data and links (null = not rendered)
  content.config.ts         content collection schemas (zod)
  content/projects/<lang>/  one markdown file per project per language
  data/career.ts            timeline entries, localized inline
  i18n/ui.ts                locales (single source) + UI strings + t()
  lib/                      data helpers (projects.ts, jsonld.ts, github.ts: build-time GitHub data, themes.ts: the theme list, achievements.ts: achievement state (013))
  layouts/Base.astro        <head>, SEO, theme pre-paint, page shell, client scripts
  pages/[...lang]/          every route, generated for every locale
  components/
    layout/                 Header, Footer, Background: on every page
    sections/               home page sections, one per file, each owns its id
    ui/                     reusable pieces (Terminal window, ProjectCard)
  pages/terminal/           /terminal/<lang>.json: the interactive terminal's data, built from site content
  scripts/                  client-side TS: theme, motion, sparkle
  scripts/terminal/         interactive terminal (007): tiny first-paint loader, lazy shell, one file per command
  styles/                   tokens.css (design tokens: dark, light + hidden themes), global.css (utilities)
```

Imports use the `@/` alias (`@/components/ui/Terminal.astro`), never `../`.

## Conventions

**i18n**
- Locales live only in `languages` in `src/i18n/ui.ts`. `astro.config.ts`, routes, hreflang, `og:locale` and the switcher all read it.
- Add a language: add it to `languages`, add its `ui` block (TypeScript fails the build if a key is missing), add `content/projects/<lang>/`, add it to the `Localized` entries in `data/career.ts`.
- The default locale (`en`) has no URL prefix.

**Content**
- New project: one `.md` per language in `content/projects/<lang>/`. The schema in `content.config.ts` validates it at build time.
- Personal data and links only in `config.ts`.
- `private: true` on a project: its repo is never linked (page, card, terminal, JSON-LD) or fetched.

**GitHub data (009)**
- Fetched once per build by `lib/github.ts` through `githubData()`/`repoData()` in `lib/projects.ts`. Missing data must fall back to the static markup, never fail the build.
- `GITHUB_TOKEN` (optional) raises the API rate limit; `GITHUB_DATA=off` skips the network (CI e2e builds with it). `.github/workflows/rebuild.yml` redeploys daily.

**Motion**
- Content is visible without JS. Scripts only hide what they're about to animate.
- All scroll motion goes through `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` in `scripts/motion.ts`.
- Markup opts in with data attributes (`data-reveal`, `data-zoom`, `data-parallax`, `data-grow`, `data-dive*`). Don't use GSAP selectors on class names.
- Don't put two tweens on the same property of the same element (CSS animation + GSAP, or reveal + parallax).

**Styling**
- Colors only through tokens in `styles/tokens.css`; every token has a value in every theme listed in `lib/themes.ts` (`styles/tokens.test.ts` checks it and the WCAG AA contrast).
- Component styles are scoped `<style>` in the component. Shared utilities go in `global.css`.

**Terminal**
- A new command is one file in `scripts/terminal/commands/` that calls `register({ name, run, complete?, man?, hidden? })`; its `term.man.<name>` string (`usage — description`) goes in `ui.ts`. No core edit.
- Listen to `bus` from `scripts/terminal/bus.ts` (`open`, `close`, `command:run`) to react to the terminal without loading it.
- Command output goes through `ctx.print`/`ctx.error` (text nodes and links only, never `innerHTML`).

## Performance budget

Measured on the home page, gzipped. Current: about 50 KB JS, 7 KB CSS, 5 KB HTML. `npm run check:size` enforces both JS rows.

| Budget | Limit |
| --- | --- |
| JS loaded on first paint | ≤ 60 KB |
| Any feature not needed for first paint | loaded with dynamic `import()` on intent (key press, click, in view) |
| Lazy terminal (shell chunk + one `/terminal/<lang>.json`) + every other lazy chunk (achievement toast, 013) | ≤ 14 KB |
| Lighthouse (mobile) | Performance ≥ 95, Accessibility ≥ 95, SEO 100 |
| CLS | 0 (animations use transform/opacity/clip-path only) |
| Images | `astro:assets`, AVIF/WebP, explicit size, lazy below the fold |

Every feature also must: work with `prefers-reduced-motion: reduce` (static fallback), be keyboard reachable if interactive, and not run any loop while the tab is hidden.
