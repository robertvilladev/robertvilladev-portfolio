import { register } from '../core';
import { bus } from '../bus';
import { ids, load, reset } from '@/lib/achievements';

const TROPHY = String.raw`
    ___________
   '._==_==_=_.'
   .-\:      /-.
  | (|:.     |) |
   '-|:.     |-'
     \::.    /
      '::. .'
        ) (
      _.' '._
     '-------'`;

// `achievements reset` arms a hidden `y`; any other command disarms it.
let pending = false;
bus.addEventListener('command:run', (e) => {
  if ((e as CustomEvent<{ name: string }>).detail.name !== 'y') pending = false;
});

register({
  name: 'achievements',
  man: 'term.man.achievements',
  complete: () => ['reset'],
  run({ args: [sub] }, ctx) {
    if (sub === 'reset') {
      pending = true;
      return void ctx.print(ctx.t('term.ach.confirm'));
    }
    if (sub) return ctx.usage();
    const { unlocked } = load();
    const n = ids.filter((id) => unlocked[id]).length;
    ctx.print(`[${'█'.repeat(Math.round((n / ids.length) * 10)).padEnd(10, '░')}] ${n}/${ids.length}`);
    for (const id of ids) {
      const at = unlocked[id];
      const line = ctx.print(`${at ? '✓' : '·'} ${ctx.t(`ach.${id}`)} — ${at ? new Date(at).toLocaleDateString(ctx.lang) : ctx.t(`ach.${id}.hint`)}`);
      if (!at) line.className = 'tx__mute';
    }
    if (n === ids.length) ctx.print(`${TROPHY}\n${ctx.t('term.ach.all')}`);
  },
});

register({
  name: 'y',
  hidden: true,
  run(_, ctx) {
    if (!pending) return ctx.error(`zsh: ${ctx.t('404.msg')}: y`);
    pending = false;
    reset();
    ctx.print(ctx.t('term.ach.wiped'));
  },
});
