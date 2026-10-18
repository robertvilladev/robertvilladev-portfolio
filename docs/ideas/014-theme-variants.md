# 014 · Theme variants

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 3 · Delight | Delight | M | S | none |

**Depends on:** [007](007-interactive-terminal.md)

## Why
Design tokens make extra palettes nearly free. Hidden themes are a good terminal reward.

## Scope
**In**
- Four hidden themes, reached with `theme matrix|amber|synthwave|night-city` in the terminal:

  | Theme | Palette | Ambient layer | Accents |
  | --- | --- | --- | --- |
  | matrix | Green phosphor on near-black | Denser rain with mixed katakana and binary columns, brighter lead glyphs | Mono display font; subtle text glow on headings |
  | amber | Single-hue amber monochrome CRT on brown-black | Scanlines, a soft vignette, a very gentle phosphor flicker (opacity change ≤ 0.04, slow) | Mono display font; glowing cursor |
  | synthwave | Magenta and orange sunset on deep purple | A perspective grid scrolling toward a horizon (transform, not background-position) and a sun disc | Neon glow on headings and window borders |
  | night-city | Cyberpunk 2077 style: acid yellow, cyan and red on near-black | Hazard-stripe band and a faint HUD grid | Angled corners on terminal windows via clip-path; a ~150 ms glitch slice on h1/h2 roughly every 7 s (small, never full-screen) |

- Hidden themes persist across reloads like dark/light.
- The browser `theme-color` follows the active theme.

**Out**
- A theme picker UI. The visible toggle stays dark/light only.
- New fonts. Themes may set `--font-display: var(--font-mono)`.

## Approach
- **One list.** `src/lib/themes.ts` is plain data with no DOM access: `[{ name, hidden }]`. `scripts/theme.ts`, the terminal `theme` command and the Base.astro inline pre-paint script all read it; the inline script gets it through `define:vars`. A saved value not in the list falls back to the prefers-color-scheme default.
- **Tokens.** Each hidden theme is a `:root[data-theme='<name>']` block in `tokens.css` that defines every token, plus `color-scheme: dark`.
- **Toggle.** When a hidden theme is active, one click goes to dark; dark and light then toggle as before. The label shows the active name (`theme: matrix`). `aria-pressed` is true only for light.
- **Terminal.** `theme` with no argument prints the current theme, the visible themes (`dark light`) and a hint (new key `term.theme.more`, en/es/ca: "…and a few more, if you know where to look"). Tab completion returns all six themes. `man theme` stays `[dark|light]`. An unknown name prints the usage line.
- **theme-color.** `setTheme` and the initial sync set `<meta name="theme-color">` from the computed `--bg`.
- **Background.** `Background.astro` renders each theme's extra layer in markup, `display: none` unless `:root[data-theme='x']` matches. CSS animations only (transform, opacity or clip-path), no JS loops.

## Guardrails
- Every theme passes WCAG AA (4.5:1): `--text --body --muted --accent --accent-2 --hash` against `--bg --bg-2 --surface`, and `--on-accent` against `--accent`. Checked by `src/styles/tokens.test.ts`.
- `prefers-reduced-motion: reduce` turns off every new animation; the palettes still apply.
- Nothing flashes faster than 3 Hz.
- Extra CSS about 2 KB gzipped; JS changes tiny. Default dark looks unchanged (Lighthouse runs on it).
- Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- ~~Which palettes?~~ matrix, amber, synthwave and night-city, as in the table above.

## Done when
- [ ] `src/lib/themes.ts` is the single list; theme.ts, the terminal command and the inline script read it
- [ ] The four hidden themes define every token, with their ambient layers and accents
- [ ] Unknown saved values fall back to the system preference
- [ ] Toggle from a hidden theme goes to dark; label shows its name; `aria-pressed` only for light
- [ ] `theme` prints current, visible themes and the hint; completion lists all six; `man theme` unchanged
- [ ] `theme-color` follows `--bg`
- [ ] `tokens.test.ts` passes for every theme; e2e covers set, reload, toggle, completion and fallback
- [ ] Reduced motion turns off every new animation; nothing flashes faster than 3 Hz
- [ ] Extra CSS ≈ 2 KB gzipped; `npm run check:size` passes
