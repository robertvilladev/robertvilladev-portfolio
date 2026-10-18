import { register } from '../core';
import { glitch } from '@/scripts/konami';

// Easter egg (012): the Konami glitch without a keyboard. Reduced motion gets the message in the terminal.
register({
  name: 'glitch',
  hidden: true,
  run(_, ctx) {
    if (ctx.reducedMotion) return void ctx.print(ctx.t('term.glitch.reduced'));
    ctx.close();
    glitch();
  },
});
