import { commands, register } from '../core';

register({
  name: 'man',
  man: 'term.man.man',
  complete: () => [...commands.values()].filter((c) => c.man && !c.hidden).map((c) => c.name),
  run({ args: [name] }, ctx) {
    if (!name) return ctx.usage();
    const man = commands.get(name)?.man;
    if (!man) return ctx.error(`${ctx.t('term.noMan')} ${name}`);
    const [usage, desc] = ctx.t(man).split(' — ');
    ctx.print(`${ctx.t('term.manName')}\n    ${name} — ${desc}\n\n${ctx.t('term.manSynopsis')}\n    ${usage}`);
  },
});
