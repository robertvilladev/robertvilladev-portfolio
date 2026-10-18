// Achievements (013) on the page: the terminal bus, page visits, clicks and the 404 page feed the core in lib/achievements.ts.
// Toasts queue in sessionStorage so one cut off by a navigation shows on the next page; ./toast is lazy.
import { bus } from './terminal/bus';
import { themes } from '@/lib/themes';
import { unlock, click, collect, onUnlock } from '@/lib/achievements';

export { unlock };

/** An unlock with its count at that moment, or a ui.ts key to show as a message. */
export type Toast = { id: string; n: number } | { text: string };

let mem: Toast[] = [];
/** The unshown toasts; pass a list to replace them. Memory only if sessionStorage is blocked. */
export function queue(next?: Toast[]): Toast[] {
  if (next) mem = next;
  try {
    if (next) sessionStorage.setItem('ach-q', JSON.stringify(next));
    else mem = JSON.parse(sessionStorage.getItem('ach-q') ?? '[]');
  } catch {}
  return mem;
}

const show = () => import('./toast').then((m) => m.run());
export function notify(t: Toast) {
  queue([...queue(), t]);
  show();
}

const root = document.documentElement;
const hidden = themes.filter((t) => t.hidden).map((t) => t.name);

if (queue().length) show();
onUnlock((id, n) => notify({ id, n }));

bus.addEventListener('open', () => unlock('terminal'));
bus.addEventListener('command:run', (e) => {
  const { name, args, flags } = (e as CustomEvent<{ name: string; args: string[]; flags: Set<string> }>).detail;
  if (name === 'sudo' && args.join(' ') === 'hire-me') unlock('hire');
  if (name === 'rm' && flags.has('r') && flags.has('f') && args[0] === '/') unlock('root');
  if (name === 'reboot') unlock('reboot');
  if (name === 'glitch') unlock('konami');
  if (name === 'theme' && hidden.includes(args[0])) {
    unlock('offgrid');
    collect('themes', args[0], hidden, 'chromatic');
  }
});

const langs = [...document.querySelectorAll<HTMLLinkElement>('link[hreflang]')].map((l) => l.hreflang).filter((l) => l !== 'x-default');
collect('langs', root.lang, langs, 'polyglot');
const slug = /\/projects\/([^/]+)/.exec(location.pathname)?.[1];
if (slug) collect('projects', slug, root.dataset.projects?.split(' ') ?? [], 'explorer');
if (document.getElementById('nf-path')) unlock('lost'); // only the 404 page has it
document.addEventListener('click', () => click());
