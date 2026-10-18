import { register } from '../core';
import { setTrail, isTrailOn } from '@/scripts/trail';

register({
  name: 'trail',
  man: 'term.man.trail',
  complete: () => ['on', 'off'],
  run({ args: [state] }, ctx) {
    if (state && state !== 'on' && state !== 'off') return ctx.usage();
    if (state) setTrail(state === 'on');
    ctx.print(`trail: ${state ?? (isTrailOn() ? 'on' : 'off')}`);
  },
});
