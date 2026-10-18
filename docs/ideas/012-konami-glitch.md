# 012 · Konami glitch mode

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 3 · Delight | Delight | M | S | none |

**Depends on:** —

## Why
A classic easter egg that fits the cyberpunk side of the design and rewards curious visitors.

## Scope
**In**
- ↑↑↓↓←→←→BA triggers about 5 s of glitch: RGB split on headings, heavier scanlines, binary burst
- A hidden terminal command, `glitch`, that triggers the same effect (the way in on mobile)

**Out**
- Anything that persists after the effect ends

## Decisions
- **Trigger.** `scripts/konami.ts`, a tiny first-paint `keydown` listener. It keeps the last 10 keys (lowercased, so B and A count in either case) and fires when they match the sequence, so overlapping starts like ↑↑↑↓… still work. Keys typed into inputs, textareas, selects and contentEditable elements are ignored, the same check the terminal loader uses.
- **Effect.** `glitch()` sets `html[data-glitch]` for 5 s; triggering it again while it runs restarts the timer. CSS in `global.css` drives it:
  - Headings (`h1`, `h2`) get a static RGB split, offset `text-shadow` in `--accent` and `--accent-2`, and jitter with the `translate` property (it composes with any GSAP `transform`) in 3 steps per 1.2 s.
  - A fixed, `pointer-events: none` scanline layer (`html[data-glitch]::after`) in `--bg`, denser than `.scan`, fades in once and drifts slowly with `transform`.
  - A binary burst: `sparkle.ts` exports `burst(x, y)` (the click burst, now reusable); `glitch()` fires 4 bursts at random points, 250 ms apart.

  Colors only through theme tokens, so it works in all six themes. Removing the attribute ends every rule; the burst nodes remove themselves.
- **Photosensitivity.** No step changes faster than 2.5 per second (under 3 Hz), no color inversion, no full-screen flash: the scanline layer fades in once and stays at a constant opacity until the end.
- **Reduced motion.** No attribute, no animation, no burst. A short static message shows in a small `role="status"` box, bottom right, for about 4 s (013 turns this into its toast). The `glitch` command prints the message in the terminal instead.
- **`glitch` command.** Hidden from `help`. Closes the terminal so the effect is visible, then calls `glitch()`.
- **Budget.** konami.ts is a few hundred bytes; the CSS is a few lines. No dependency.

## Guardrails
Reduced motion: show a static message instead. No flashing faster than 3 Hz (photosensitivity). Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Done when
- [x] The key sequence sets `html[data-glitch]` and it clears after about 5 s; B and A count in either case
- [x] Keys typed into a text field never trigger it
- [x] `glitch` triggers the same effect and is hidden from `help`
- [x] Reduced motion shows the static message and no animation
- [x] Works in every theme; nothing flashes faster than 3 Hz
- [x] e2e tests cover the above
