// Theme toggle. The initial theme is set by the inline script in Base.astro before paint.
const root = document.documentElement;
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

const sync = () => {
  const theme = root.dataset.theme === 'light' ? 'light' : 'dark';
  buttons.forEach((b) => {
    b.setAttribute('aria-pressed', String(theme === 'light'));
    const name = b.querySelector('[data-theme-name]');
    if (name) name.textContent = theme;
  });
};

buttons.forEach((b) =>
  b.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
    sync();
  }),
);

sync();
