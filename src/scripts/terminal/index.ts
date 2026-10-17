// Loads the terminal shell on intent: `/` or backtick outside text fields, a [data-terminal-open]
// click, or a page load while it was open (sessionStorage). Keep this file tiny: it is first-paint JS.
const load = () => import('./shell').then((m) => m.open());

addEventListener('keydown', (e) => {
  const el = e.target as HTMLElement;
  if ((e.key !== '/' && e.key !== '`') || e.ctrlKey || e.metaKey || e.altKey) return;
  if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  e.preventDefault();
  load();
});
document.querySelectorAll('[data-terminal-open]').forEach((b) => b.addEventListener('click', load));
try { if (JSON.parse(sessionStorage.getItem('term') ?? '{}').open) load(); } catch {}
