// Skip/cleanup for the boot overlay (015). The overlay is pure CSS and ends on its own; this makes it
// skippable and removes the listeners. `play()` is also used by the `reboot` terminal command.
const root = document.documentElement;
const EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const;
let timer: number;

const swallow = (e: Event) => e.stopPropagation();

function stop() {
  clearTimeout(timer);
  delete root.dataset.boot;
  for (const t of EVENTS) removeEventListener(t, skip, true);
}

function skip(e: Event) {
  e.stopPropagation(); // the skipping input does nothing else
  if (e.type === 'pointerdown') {
    e.preventDefault();
    addEventListener('click', swallow, { capture: true, once: true });
    setTimeout(() => removeEventListener('click', swallow, true), 500);
  }
  stop();
}

export function play() {
  stop();
  root.dataset.boot = '';
  for (const t of EVENTS) addEventListener(t, skip, { capture: true, passive: t !== 'pointerdown' });
  timer = window.setTimeout(stop, 1800);
}

if ('boot' in root.dataset) play();
