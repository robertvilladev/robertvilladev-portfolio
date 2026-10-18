// Clicking empty space sprinkles a burst of 0s and 1s.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const BITS = 12;
const MAX_LIVE = 120; // ponytail: hard cap on live nodes instead of pooling; pool if bursts ever get heavier

const layer = document.createElement('div');
layer.setAttribute('aria-hidden', 'true');
layer.className = 'sparkle-layer';
document.body.append(layer);

const style = document.createElement('style');
style.textContent = `
.sparkle-layer{position:fixed;inset:0;z-index:90;pointer-events:none;overflow:hidden}
.sparkle-layer span{position:absolute;font:700 13px var(--font-mono);animation:sparkle .9s var(--ease-out) var(--delay) both}
@keyframes sparkle{from{opacity:1;transform:translate(0,0) scale(1)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.6)}}`;
document.head.append(style);

/** A burst of bits at viewport point (x, y). Also used by the Konami glitch (012). */
export function burst(x: number, y: number) {
  if (reduced.matches || layer.childElementCount > MAX_LIVE) return;
  for (let i = 0; i < BITS; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 28 + Math.random() * 56;
    const bit = document.createElement('span');
    bit.textContent = Math.random() < 0.5 ? '0' : '1';
    bit.style.cssText = `left:${x - 4}px;top:${y - 8}px;color:var(${i % 3 ? '--accent' : '--accent-2'});--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist - 12}px;--delay:${Math.random() * 0.12}s`;
    layer.append(bit);
  }
  // Timer rather than animationend: background tabs pause animations and would never fire it.
  const bits = [...layer.children].slice(-BITS);
  setTimeout(() => bits.forEach((b) => b.remove()), 1200);
}

document.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || (e.target as Element).closest('a, button, input, textarea, select, label, [data-no-sparkle]')) return;
  burst(e.clientX, e.clientY);
});
