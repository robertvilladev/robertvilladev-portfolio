import { paths, register, stat } from '../core';

register({
  name: 'cd',
  man: 'term.man.cd',
  complete: (w, ctx) => paths(ctx.fs, ctx.cwd, w, true),
  run({ args: [p = '~'] }, ctx) {
    const { at, node } = stat(ctx.fs, ctx.cwd, p);
    if (node === undefined) ctx.error(`cd: ${ctx.t('term.noSuch')}: ${p}`);
    else if (typeof node === 'string') ctx.error(`cd: ${ctx.t('term.notDir')}: ${p}`);
    else ctx.cwd = at!;
  },
});
