// Theme toggle and setTheme(), shared with the terminal's `theme` command.
// The initial theme is set by the inline script in Base.astro before paint.
const root = document.documentElement;
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

const sync = () => {
  const theme = root.dataset.theme ?? 'dark';
  buttons.forEach((b) => {
    b.setAttribute('aria-pressed', String(theme === 'light'));
    const name = b.querySelector('[data-theme-name]');
    if (name) name.textContent = theme;
  });
  meta?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
};

export function setTheme(name: string) {
  root.dataset.theme = name;
  try { localStorage.setItem('theme', name); } catch {}
  sync();
}

// From a hidden theme, one click goes back to dark.
buttons.forEach((b) => b.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')));

sync();
