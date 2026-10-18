// Achievement toasts (013). Lazy: loaded by ./achievements on the first unlock or when toasts are waiting.
// One at a time, about 4 s each, bottom right. Waits for the boot panel (015), never takes focus, no slide under reduced motion.
import { queue } from './achievements';
import { ids } from '@/lib/achievements';

const root = document.documentElement;
const region = document.createElement('div');
region.className = 'toast mono';
region.setAttribute('aria-live', 'polite');
region.popover = 'manual'; // top layer, so it can sit above the open terminal
const style = document.createElement('style');
style.textContent = `
.toast{position:fixed;inset:auto 16px 16px auto;z-index:96;max-width:calc(100vw - 32px);margin:0;padding:0;border:0;background:none;overflow:visible;pointer-events:none}
.toast__card{padding:10px 14px;border:1px solid var(--accent);background:var(--surface);color:var(--text);font-size:13px;box-shadow:0 10px 30px var(--glow)}
.toast__card b{color:var(--accent)}
.toast__bar{display:flex;gap:2px;margin-top:8px}
.toast__bar i{width:10px;height:6px;background:var(--line)}
.toast__bar .on{background:var(--accent)}
@media (prefers-reduced-motion:no-preference){.toast__card{animation:toast 4s var(--ease-out) both}}
@keyframes toast{0%,100%{transform:translateX(calc(100% + 24px))}8%,92%{transform:none}}`;
document.body.append(style, region);

let strings: Promise<Record<string, string>> | undefined;
let running = false;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const noBoot = () =>
  new Promise<void>((done) => {
    const check = () => 'boot' in root.dataset || (mo.disconnect(), done());
    const mo = new MutationObserver(check);
    mo.observe(root, { attributeFilter: ['data-boot'] });
    check();
  });
const raise = () => {
  try { region.hidePopover(); region.showPopover(); } catch {}
};

export async function run() {
  if (running) return;
  running = true;
  const s = await (strings ??= fetch(`/terminal/${root.lang}.json`).then((r) => r.json()).then((d) => d.strings).catch(() => ({})));
  const t = (k: string) => s[k] ?? k;
  for (let q = queue(); q.length; q = queue()) {
    await noBoot();
    const item = q[0];
    const card = document.createElement('div');
    card.className = 'toast__card';
    if ('id' in item) {
      const title = document.createElement('b');
      title.textContent = t('ach.title');
      const bar = document.createElement('div');
      bar.className = 'toast__bar';
      bar.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < ids.length; i++) bar.append(Object.assign(document.createElement('i'), { className: i < item.n ? 'on' : '' }));
      card.append(title, ` · ${t(`ach.${item.id}`)} · ${item.n}/${ids.length}`, bar);
    } else card.textContent = t(item.text);
    raise();
    region.replaceChildren(card);
    await wait(4000);
    region.replaceChildren();
    queue(queue().slice(1));
  }
  region.hidePopover?.();
  running = false;
}
