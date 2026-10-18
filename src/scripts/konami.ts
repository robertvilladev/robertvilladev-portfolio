// Konami code (012): ↑↑↓↓←→←→BA sets html[data-glitch] for 5 s; CSS in global.css does the rest.
// First-paint JS, so keep it tiny. `glitch()` is also the hidden `glitch` terminal command.
import { burst } from './sparkle';
import { notify, unlock } from './achievements';

const CODE = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
const root = document.documentElement;
let keys: string[] = [];
let timer: number;

export function glitch() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return notify({ text: 'term.glitch.reduced' });
  root.dataset.glitch = '';
  clearTimeout(timer);
  timer = window.setTimeout(() => delete root.dataset.glitch, 5000);
  for (let i = 0; i < 4; i++) setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight), i * 250);
}

addEventListener('keydown', (e) => {
  const el = e.target as HTMLElement;
  if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  keys = [...keys, e.key.toLowerCase()].slice(-10);
  if (keys.join() === CODE) {
    keys = [];
    glitch();
    unlock('konami');
  }
});
