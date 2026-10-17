# 007 · Interactive terminal

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 1 · Signature | Interaction | H | M | low |

**Depends on:** —

## Why
The signature feature. The whole site already looks like a terminal; this makes it one. Recruiters can explore fast, developers will play with it.

## Scope
**In**
- Open with `/` or the backtick key, or a visible `>_` button (touch devices)
- Commands: `help`, `ls [projects]`, `cd <project|~|..>`, `cat about.md`, `open <project>`, `theme dark|light`, `lang en|es|ca`, `whoami`, `clear`, `exit`
- Jokes: `sudo hire-me` (opens contact), `rm -rf /` (fake meltdown, respects reduced motion)
- History with arrow keys, tab completion for project names
- Localized output

**Out**
- A real shell or anything that talks to a server

## Approach
`scripts/terminal/` with a command registry (`Record<string, (args, ctx) => Output>`), so later features (013, 014) add commands without touching the core. The shell is loaded with dynamic `import()` on the first key press, so first paint does not grow. Data (projects, career, strings) is embedded as JSON at build time.

## Guardrails
Focus trap while open, Escape closes, `aria-live` output, works without a mouse. Not loaded until used. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Overlay modal, or take over the hero terminal in place?
- Should the hero terminal type a hint like `press / to type`?

## Done when
- [ ] All commands work in all three languages
- [ ] Lazy chunk under 10 KB gzipped
- [ ] Keyboard and screen-reader usable
