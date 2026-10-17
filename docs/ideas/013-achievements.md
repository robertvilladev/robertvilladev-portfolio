# 013 · Achievements

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 3 · Delight | Delight | M | S | none |

**Depends on:** [007](007-interactive-terminal.md), [012](012-konami-glitch.md)

## Why
Turns the easter eggs into a small game: visitors who find them get a toast, and the terminal lists what is left to find.

## Scope
**In**
- Unlocks: opened the terminal, Konami code, visited all three languages, `sudo hire-me`, clicked 100 times, read every project
- Toast styled as a system notification
- `achievements` command in the terminal

**Out**
- Accounts or server storage

## Approach
`scripts/achievements.ts`: a tiny event bus (`unlock(id)`) + `localStorage` (wrapped in try/catch). Other features call `unlock`.

## Guardrails
Toasts in an `aria-live="polite"` region; never cover content for long. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Which unlocks are fun but not annoying?

## Done when
- [ ] Unlocks persist per visitor and show in the terminal
