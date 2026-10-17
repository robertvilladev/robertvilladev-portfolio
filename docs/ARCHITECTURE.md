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
  lib/                      data helpers used by pages (projects.ts)
  layouts/Base.astro        <head>, SEO, theme pre-paint, page shell, client scripts
  pages/[...lang]/          every route, generated for every locale
  components/
    layout/                 Header, Footer, Background: on every page
    sections/               home page sections, one per file, each owns its id
    ui/                     reusable pieces (Terminal window, ProjectCard)
  scripts/                  client-side TS: theme, motion, sparkle
  styles/                   tokens.css (design tokens, dark + light), global.css (utilities)
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

**Motion**
- Content is visible without JS. Scripts only hide what they're about to animate.
- All scroll motion goes through `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` in `scripts/motion.ts`.
- Markup opts in with data attributes (`data-reveal`, `data-zoom`, `data-parallax`, `data-grow`, `data-dive*`). Don't use GSAP selectors on class names.
- Don't put two tweens on the same property of the same element (CSS animation + GSAP, or reveal + parallax).

**Styling**
- Colors only through tokens in `styles/tokens.css`; every token has a light-theme value.
- Component styles are scoped `<style>` in the component. Shared utilities go in `global.css`.

## Performance budget

Measured on the home page, gzipped. Current: about 49 KB JS, 7 KB CSS, 5 KB HTML.

| Budget | Limit |
| --- | --- |
| JS loaded on first paint | ≤ 60 KB |
| Any feature not needed for first paint | loaded with dynamic `import()` on intent (key press, click, in view) |
| Lighthouse (mobile) | Performance ≥ 95, Accessibility ≥ 95, SEO 100 |
| CLS | 0 (animations use transform/opacity/clip-path only) |
| Images | `astro:assets`, AVIF/WebP, explicit size, lazy below the fold |

Every feature also must: work with `prefers-reduced-motion: reduce` (static fallback), be keyboard reachable if interactive, and not run any loop while the tab is hidden.
