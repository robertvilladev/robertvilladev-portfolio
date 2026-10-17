import { paths, register, stat } from '../core';

register({
  name: 'ls',
  man: 'term.man.ls',
  complete: (w, ctx) => paths(ctx.fs, ctx.cwd, w),
  run({ args: [p = ''] }, ctx) {
    const { node } = stat(ctx.fs, ctx.cwd, p);
    if (node === undefined) return ctx.error(`ls: ${ctx.t('term.noSuch')}: ${p}`);
    if (typeof node === 'string') return void ctx.print(p);
    for (const [name, n] of Object.entries(node)) {
      if (typeof n === 'object') ctx.print(`${name}/`).className = 'tx__dir';
      else ctx.print(name);
    }
  },
});
