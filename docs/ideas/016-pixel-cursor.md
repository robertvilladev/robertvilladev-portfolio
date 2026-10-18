# 016 · Pixel cursor trail

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 3 · Delight | Delight | L | S | low |

**Depends on:** —

## Why
A small pixel square that follows the pointer with a grid snap adds texture on desktop.

## Scope
**In**
- Trail of 3–4 squares snapping to an 8px grid, accent colored
- Grows over links and buttons

**Out**
- Touch devices; replacing the system cursor

## Approach
`src/scripts/trail.ts` (~1 KB gzipped), imported in Base.astro's bundle.

- **Gating:** only when `matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')` matches and `localStorage.trail` isn't `'off'` (storage in try/catch). Listens to the query changing. With no JS there is no markup.
- **Elements:** four fixed `<i>` squares in an `aria-hidden`, `pointer-events: none` container at z-index 80, below sparkle (90) and the terminal.
- **Motion:** the head snaps to the 8px grid at the pointer; each follower eases toward the one in front. `translate3d` only. `pointermove` starts a `requestAnimationFrame` loop that stops once every square is within 0.5px of its target, and also on `visibilitychange` to hidden. Squares fade (opacity) out when the pointer leaves the window and back in on return.
- **Grow:** on `pointerover`, if `closest('a, button, [role=button], summary, label, input, select, textarea, [data-terminal-open]')` matches, the container gets `data-grow` and the head scales ~2× through transform.
- **Terminal:** the shell root is `[data-no-trail]`; the trail hides while the pointer is over it, since people type there.
- **Per-theme looks (CSS on `:root[data-theme=…]` and tokens), kept subtle:** dark/light 8px `--accent` squares; matrix tiny green glyphs (`0`, `1`, `ア`…, textContent set in JS, only in matrix); synthwave neon squares with glow; night-city squares alternating `--accent` / `--accent-2`; amber squares with a phosphor glow.
- **`trail on|off` terminal command:** listed in `help`, man string `term.man.trail` (en/es/ca). Saves to `localStorage.trail` and applies at once through `setTrail()` exported from `trail.ts`. No argument prints the state; an unknown argument prints usage.

## Guardrails
No loop while idle or hidden; `transform` and `opacity` only. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- ~~Worth it next to the click sparkle?~~ Yes: the sparkle reacts to clicks, the trail to movement, and the trail is opt-out with `trail off`.

## Done when
- [x] No measurable main-thread cost when the mouse is still (zero rAF calls from the trail after it settles)
- [x] Four squares follow the pointer on an 8px grid and grow over interactive elements
- [x] No trail under reduced motion or on coarse pointers; `trail off` persists across reloads
- [x] Looks right in all six themes and is hidden over the open terminal
- [x] e2e tests, `npm run check:size` and the build pass
