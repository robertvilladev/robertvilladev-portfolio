# 014 · Theme variants

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 3 · Delight | Delight | M | S | none |

**Depends on:** [007](007-interactive-terminal.md)

## Why
Design tokens make extra palettes nearly free. Hidden themes are a good terminal reward.

## Scope
**In**
- Hidden themes via `theme matrix|amber|synthwave`
- The visible toggle stays dark/light only

**Out**
- A theme picker UI

## Approach
Extra `:root[data-theme="…"]` blocks in `tokens.css`; `theme.ts` accepts any known theme name.

## Guardrails
Each palette passes WCAG AA contrast for body text. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Which palettes?

## Done when
- [ ] Each hidden theme passes contrast checks and persists like dark/light
