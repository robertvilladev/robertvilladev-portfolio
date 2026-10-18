// Every theme tokens.css defines (dark is `:root`). Hidden ones are only reachable from the terminal (014).
// Plain data: read by scripts/theme.ts, the terminal `theme` command and the inline pre-paint script in Base.astro.
export const themes = [
  { name: 'dark', hidden: false },
  { name: 'light', hidden: false },
  { name: 'matrix', hidden: true },
  { name: 'amber', hidden: true },
  { name: 'synthwave', hidden: true },
  { name: 'night-city', hidden: true },
];

export const themeNames = themes.map((t) => t.name);
