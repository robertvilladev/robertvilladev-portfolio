# 007 · Interactive terminal

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 1 · Signature | Interaction | H | M | low |

**Depends on:** —

## Why
The signature feature. The whole site already looks like a terminal; this makes it one. Recruiters can explore fast, developers will play with it.

## Scope
**In**
- A Quake-style drop-down overlay on every page (home, project pages, 404), opened with `/`, the backtick key, or a `>_` button in the header (touch and mouse)
- A virtual filesystem generated from site content: `~/about.md`, `~/career.log`, `~/contact`, `~/projects/<slug>/README.md`
- Commands: `help`, `ls`, `cd`, `cat`, `tree`, `open <slug> [--repo|--demo]`, `theme dark|light`, `lang en|es|ca`, `whoami`, `neofetch`, `contact`, `email`, `history`, `man <cmd>`, `clear`, `exit`
- Jokes: `sudo hire-me` (closes and scrolls to contact), `rm -rf /` (fake meltdown, text only with reduced motion)
- History with arrow keys, tab completion for commands and paths, "did you mean" for close typos
- Localized output (en/es/ca); state survives navigation within the tab
- The hero's last prompt line types a hint (`press / to type`, `tap >_ to type` on touch)

**Out**
- A real shell or anything that talks to a server
- Typing into the hero terminal: its pinned GSAP dive (`scripts/motion.ts`) stays untouched

## Approach

### Architecture
```
Base.astro <script>  ──imports──▶  terminal/index.ts   (first paint, < 1 KB)
                                     · listens for / and ` (not while typing in a field), [data-terminal-open] clicks
                                     · reopens if sessionStorage says it was open
                                     · import('./shell') on intent
terminal/bus.ts (1 line: EventTarget, shared by whoever imports it)
shell.ts (lazy chunk)  ── fetch ──▶  /terminal/<lang>.json   (build-time endpoint)
  · builds a <dialog>, runs input → parse → registry → command.run(args, ctx)
  · import.meta.glob('./commands/*.ts', { eager: true }) — each module calls register()
core.ts (pure, no DOM, no imports): parse, registry, fs resolve/list, completion, edit distance
```

- **Dialog:** native `<dialog>` + `showModal()`. That gives the focus trap (page becomes inert), Escape to close, the dimmed `::backdrop`, and focus returning to the opener, with no custom code. `aria-label` from strings, `role="log"` + `aria-live="polite"` output, a 44 px close button, `data-lenis-prevent` so wheel scrolls the output instead of Lenis. Slides from the top with a CSS animation that reduced motion turns off.
- **Event bus:** `bus.ts` exports `bus = new EventTarget()`. Events: `open`, `close`, `command:run` (`detail: { name, args, flags }`). Today only the shell imports it; when 013 imports it from first-paint code, Vite moves it into that bundle and both share one instance, so 013 can listen (e.g. "opened the terminal") without loading the shell.
- **Registry:** `register({ name, run, complete?, man?, hidden? })` in `core.ts`. A new command is a new file in `commands/`: no core edit. 013 adds `commands/achievements.ts`; 014 adds names to `themes` in `theme.ts` and the `theme` command picks them up for running and completion.
- **ctx** given to commands: `fs`, `cwd` (segments, read/write), `data` (the JSON), `print(...parts)` (one output line; strings are text nodes with URLs/emails auto-linked, `link(text, href)` for explicit links; never `innerHTML`), `t(key)`, `lang`, `navigate(url)`, `openTab(url)` (`noopener`), `setTheme`, `reducedMotion`, `history`, `clear()`, `close()`.
- **Filesystem:** `type Dir = { [name: string]: Dir | string }` (string = file contents). Home is the root: `/` and `~` both mean home, `..` at home stays home. `ls`, `cd`, `cat`, `tree` and path completion all work over it.
- **Data endpoint:** `src/pages/terminal/[lang].json.ts` (static, one per locale) builds `{ lang, home, name, role, email, links, since, stack, strings, fs, projects }` from `config.ts`, `data/career.ts`, the projects collection (summary + raw markdown body) and `ui.ts`. Fetched on first open, so no page grows.
- **Strings:** `term.*` keys in `ui.ts` for all three locales (the `Record<Lang, …>` type fails the build on a missing key). The endpoint ships `term.*` plus reused keys (`404.msg`, `404.hint`, `hero.role`, `lang.egg`, `theme.name`). Man pages are `term.man.<cmd>` = `usage — description`; `help` and `man` both read them.
- **lang:** navigates to the header's language link for that locale (`a[hreflang=<l>]`), which is already built with `getRelativeLocaleUrl` and the `ui.ts` helpers, so it lands on the same page in the target locale.
- **theme:** `theme.ts` exports `themes` and `setTheme(name)`; the header toggle and the command both use it.
- **State:** `sessionStorage.term = { open, cwd, history }` (try/catch, history capped at 50), saved after every command and on `pagehide` (the dialog's `close` event lands a task late, after a navigation may have started). Reopens after navigation with history and cwd.
- **Unknown command:** `zsh: <404.msg>: x`, plus `<404.hint> <cmd>?` when the edit distance is ≤ 1 (≤ 2 for names longer than 4).

### File layout
```
src/scripts/terminal/
  index.ts            loader (first paint)
  bus.ts              event bus
  core.ts             parse, register/commands, resolve/list, complete, distance
  core.test.ts        node:test unit tests
  shell.ts            dialog UI, input, history, ctx, persistence
  shell.css           overlay styles, imported `?inline` so Astro doesn't hoist them into every page
  commands/*.ts       one module per command (contact + email share one)
src/pages/terminal/[lang].json.ts
tests/terminal.spec.ts
```
Touched: `Base.astro` (import loader), `Header.astro` (`>_` button), `Hero.astro` (hint), `theme.ts` (`setTheme`), `config.ts` (`stack`, shared by hero and terminal), `ui.ts` (strings), `scripts/check-js-size.mjs`, `package.json` (`test:unit`), `quality.yml`.

### Phases (one commit each)
1. **Core**: `core.ts` + unit tests (`npm run test:unit`, `node --test`).
2. **Data + shell**: JSON endpoint, loader, bus, dialog shell, `theme.ts` refactor, header button.
3. **Commands + strings**: every command, all strings in en/es/ca, hero hint.
4. **Quality**: Playwright `tests/terminal.spec.ts`, size-budget split, CI step.

### Test plan
- **Unit** (`node:test`, no framework): parser (quotes, short/long flags), fs resolve (`~`, `..`, `/`, files vs dirs), completion (commands, nested paths, common prefix), edit distance and suggestions.
- **E2E** (`tests/terminal.spec.ts`): open/close via `/`, backtick, button, Escape, `exit`; focus returns to the button; `/` ignored inside inputs; every command in en/es/ca with localized output; `open` navigates and `--repo` opens a new tab; `lang` keeps the page; `sudo hire-me` lands on `#contact`; `rm -rf /` with reduced motion; keyboard-only flow (Tab completion, arrow history); axe on the open terminal; persistence across navigation; usable at 375 px.

### Budgets
- First-paint JS unchanged apart from the loader and Vite's dynamic-import helper (≈ 0.8 KB together) and still ≤ 60 KB. Measured: 49.0 → 50.0 KB.
- Lazy terminal (JS + CSS chunks only the shell loads + the largest `/terminal/<lang>.json`) ≤ 10 KB gzipped. Measured: 4.9 KB shell + 3.6 KB JSON = 8.5 KB. `check-js-size.mjs` measures first paint from the home page's HTML and its static imports, and the lazy set as every `_astro` asset no HTML page references.

## Guardrails
Focus trap while open, Escape closes, `aria-live` output, works without a mouse, ≥ 44 px targets, 16 px input (no iOS zoom). Not loaded until used. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Resolved questions
- **Overlay or hero takeover?** Overlay on every page; the hero dive stays as it is.
- **Hero hint?** Yes, typed with the existing CSS animation, so it works without JS.

## Done when
- [x] All commands work in all three languages
- [x] Lazy chunk under 10 KB gzipped
- [x] Keyboard and screen-reader usable
