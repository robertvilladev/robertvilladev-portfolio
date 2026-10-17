import { commands, register } from '../core';

register({
  name: 'help',
  man: 'term.man.help',
  run(_, ctx) {
    const visible = [...commands.values()].filter((c) => !c.hidden && c.man);
    ctx.print(visible.map((c) => c.name.padEnd(10) + ctx.t(c.man!).split(' — ')[1]).join('\n'));
  },
});
