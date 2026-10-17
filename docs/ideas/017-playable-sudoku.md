# 017 · Playable sudoku demo

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 4 · Depth | Interaction | H | L | low |

**Depends on:** [011](011-project-media.md)

## Why
The strongest proof of skill: a real puzzle from the sudoku-2077 API, playable on its project page, with a hint that names the technique needed.

## Scope
**In**
- Fetch one puzzle by level from the live API
- Play inside the terminal window; `hint` highlights the next technique
- Fallback puzzle bundled for when the API is down

**Out**
- Accounts, scores, the full app

## Approach
One island (vanilla TS or a small Preact island) loaded with `client:visible` only on the sudoku page.

## Guardrails
Fully keyboard playable; zero cost on every other page. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Can `sudoku-core` be imported directly for hints instead of calling the API?
- CORS on the API for robertvilla.dev?

## Done when
- [ ] Playable on desktop and mobile; page still scores ≥ 95
