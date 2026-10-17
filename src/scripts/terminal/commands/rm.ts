import { register } from '../core';

const doomed = ['/bin', '/etc', '/usr/lib/node_modules', '/home/robert/projects', '/var/www/portfolio'];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Easter egg: `rm -rf /` glitches the page, then owns up. Reduced motion gets the text only.
register({
  name: 'rm',
  hidden: true,
  async run({ args, flags }, ctx) {
    if (!(flags.has('r') && flags.has('f') && args[0] === '/')) return ctx.error(`rm: ${ctx.t('term.rm.denied')}`);
    const root = document.documentElement;
    if (!ctx.reducedMotion) root.classList.add('tx-melt');
    for (const d of doomed) {
      ctx.print(`rm: ${ctx.t('term.rm.removing')} ${d}`).className = 'tx__err';
      if (!ctx.reducedMotion) await wait(220);
    }
    root.classList.remove('tx-melt');
    ctx.print(ctx.t('term.rm.kidding'));
  },
});
