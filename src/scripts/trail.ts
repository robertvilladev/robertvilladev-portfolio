// Four pixel squares that follow a fine pointer on an 8px grid. The rAF loop runs only while
// something is still moving; `trail off` (localStorage.trail) and reduced motion remove the markup.
const mq = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
const GRID = 8;
const GROW = 'a, button, [role=button], summary, label, input, select, textarea, [data-terminal-open]';
const GLYPHS = ['0', '1', 'ア', '0'];

const style = document.createElement('style');
style.textContent = `
.trail{position:fixed;top:0;left:0;z-index:80;pointer-events:none;transition:opacity .2s}
.trail[data-out],.trail[data-hide]{opacity:0}
.trail i{position:absolute;top:0;left:0;width:8px;height:8px;margin:-4px 0 0 -4px;background:var(--accent);font:700 0/8px var(--font-mono);will-change:transform}
.trail i:nth-child(2){opacity:.7}.trail i:nth-child(3){opacity:.45}.trail i:nth-child(4){opacity:.25}
.trail i:first-child{transition:scale .15s var(--ease-out)}
.trail[data-grow] i:first-child{scale:2}
:root[data-theme=matrix] .trail i{width:auto;height:auto;margin:-5px 0 0 -3px;background:none;color:var(--accent);font-size:11px;line-height:1;text-shadow:0 0 6px var(--glow)}
:root[data-theme=amber] .trail i{box-shadow:0 0 6px var(--accent),0 0 14px var(--glow)}
:root[data-theme=synthwave] .trail i{box-shadow:0 0 6px var(--accent),0 0 16px var(--accent)}
:root[data-theme=night-city] .trail i:nth-child(even){background:var(--accent-2)}`;
document.head.append(style);

let box: HTMLElement | undefined;
let off: AbortController | undefined;
let raf = 0;
let squares: HTMLElement[] = [];
let pos: { x: number; y: number }[] = [];
let head = { x: 0, y: 0 };
let seen = false;

const stored = () => { try { return localStorage.trail !== 'off'; } catch { return true; } };
export const isTrailOn = () => !!box;

function tick() {
  raf = 0;
  let moving = false;
  pos.forEach((p, i) => {
    const to = i ? pos[i - 1] : head;
    const dx = to.x - p.x, dy = to.y - p.y;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      moving = true;
      p.x += dx * (i ? 0.35 : 1);
      p.y += dy * (i ? 0.35 : 1);
    } else if (dx || dy) { p.x = to.x; p.y = to.y; }
    squares[i].style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
  });
  if (moving) raf = requestAnimationFrame(tick);
}
const wake = () => { raf ||= requestAnimationFrame(tick); };

function enable() {
  if (box) return;
  box = document.createElement('div');
  box.className = 'trail';
  box.dataset.out = '';
  box.setAttribute('aria-hidden', 'true');
  squares = GLYPHS.map((g) => Object.assign(document.createElement('i'), { textContent: g }));
  pos = squares.map(() => ({ x: 0, y: 0 }));
  box.append(...squares);
  document.body.append(box);
  seen = false;
  off = new AbortController();
  const on = { signal: off.signal };
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    head = { x: Math.round(e.clientX / GRID) * GRID, y: Math.round(e.clientY / GRID) * GRID };
    if (!seen) { seen = true; pos.forEach((p) => Object.assign(p, head)); }
    delete box!.dataset.out;
    wake();
  }, on);
  addEventListener('pointerover', (e) => {
    const el = e.target as Element;
    box!.toggleAttribute('data-grow', !!el.closest?.(GROW));
    box!.toggleAttribute('data-hide', !!el.closest?.('[data-no-trail]'));
  }, on);
  document.documentElement.addEventListener('pointerleave', () => box && (box.dataset.out = ''), on);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
  }, on);
}

function disable() {
  off?.abort();
  cancelAnimationFrame(raf);
  raf = 0;
  box?.remove();
  box = undefined;
}

const sync = () => (mq.matches && stored() ? enable() : disable());

/** Turns the trail on or off now and remembers the choice. */
export function setTrail(on: boolean) {
  try { localStorage.setItem('trail', on ? 'on' : 'off'); } catch {}
  sync();
}

mq.addEventListener('change', sync);
sync();
