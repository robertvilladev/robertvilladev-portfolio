import { register } from '../core';

// Easter egg: `sudo hire-me` jokes, then closes and lands on the contact section.
register({
  name: 'sudo',
  hidden: true,
  run({ args }, ctx) {
    if (args.join(' ') !== 'hire-me') return ctx.error(ctx.t('term.sudo.no'));
    ctx.print(ctx.t('term.sudo.hire'));
    setTimeout(() => {
      ctx.close();
      ctx.navigate(`${ctx.data.home}#contact`);
    }, ctx.reducedMotion ? 300 : 1200);
  },
});
