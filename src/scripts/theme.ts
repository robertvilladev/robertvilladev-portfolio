// Theme toggle and setTheme(), shared with the terminal's `theme` command.
// The initial theme is set by the inline script in Base.astro before paint.
const root = document.documentElement;
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

/** Every theme name tokens.css defines. 014 adds its hidden themes here. */
export const themes = ['dark', 'light'];

const sync = () => {
  const theme = root.dataset.theme ?? 'dark';
  buttons.forEach((b) => {
    b.setAttribute('aria-pressed', String(theme === 'light'));
    const name = b.querySelector('[data-theme-name]');
    if (name) name.textContent = theme;
  });
};

export function setTheme(name: string) {
  root.dataset.theme = name;
  try { localStorage.setItem('theme', name); } catch {}
  sync();
}

buttons.forEach((b) => b.addEventListener('click', () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light')));

sync();
