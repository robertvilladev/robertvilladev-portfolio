# 015 · First-visit boot log

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| planned | 3 · Delight | Delight | M | S | low |

**Depends on:** —

## Why
A short BIOS-style intro sets the tone, once.

## Scope
**In**
- About 1.5 s of staggered BIOS/POST-style boot lines, then a CRT-off collapse (about 0.25 s). Total under 2 s
- First visit to home only, skippable with any key, click, scroll or touch
- A hidden `reboot` terminal command that replays it

**Out**
- Repeat visits; anything longer than 2 s; project pages as a first landing

## Decisions
- **When it shows.** An inline `<head>` script, before paint, sets `html[data-boot]` only if: the page is home in any locale (`/`, `/es/`, `/ca/`), localStorage has no `booted` flag, `prefers-reduced-motion` is not `reduce`, and localStorage is usable (try/catch; if blocked, never show, since the visit can't be remembered). The flag is saved as soon as the overlay is shown, so a reload mid-boot doesn't replay it. No JS, no overlay.
- **Overlay.** Markup lives in `Base.astro` so it exists on every page (this lets `reboot` work anywhere). CSS shows it only under `html[data-boot]`. `position: fixed`, above the header, `aria-hidden="true"`, `data-no-sparkle`, never takes focus. About 8 lines, staggered with CSS animations over about 1.5 s, then it collapses (scaleY to a line, then fade). The lines are English in every locale; a couple use build-time facts (project count, latest commit SHA from `latest()` when there is data). Colors come from theme tokens only, so it fits every theme. Only opacity and transform are animated.
- **Hero underneath.** The hero typing runs underneath, unchanged: no LCP cost, no CLS. Visitors land partway through the typing; accepted. (Resolves the open question: overlay, not merged with the hero.)
- **Skipping.** Any `keydown`, `pointerdown`, `wheel` or `touchstart` removes the overlay instantly. The skipping input does nothing else: listeners run in the capture phase and stop propagation, and `pointerdown` is also `preventDefault`ed, so a click doesn't follow a link underneath and `/` or a backtick doesn't open the terminal. A timeout at about 1.8 s is the fallback; afterwards all listeners are removed.
- **`reboot`.** Hidden from `help`. Closes the terminal, then replays the overlay on the current page (no `booted` flag needed). Under reduced motion it prints the boot lines inside the terminal instead.
- **Budget.** Tiny inline JS, no dependency, first-paint JS budget respected.

## Guardrails
Must not delay LCP: the hero renders underneath; skipped entirely under reduced motion. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Done when
- [ ] LCP unchanged in Lighthouse (lhci always runs as a first visit); Performance ≥ 95, CLS ≤ 0.001
- [ ] Shown once per browser, on home only; a second visit and a first visit to a project page show nothing
- [ ] Any key, click, scroll or touch skips it instantly and does nothing else
- [ ] No overlay under reduced motion or with blocked localStorage
- [ ] `reboot` replays it (or prints the lines in the terminal under reduced motion), hidden from `help`
- [ ] e2e tests cover the above; existing tests run with `booted` preset
