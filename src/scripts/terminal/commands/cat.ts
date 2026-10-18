import { paths, register, stat } from '../core';

register({
  name: 'cat',
  man: 'term.man.cat',
  complete: (w, ctx) => paths(ctx.fs, ctx.cwd, w),
  run({ args: [p] }, ctx) {
    if (!p) return ctx.usage();
    const { at, node } = stat(ctx.fs, ctx.cwd, p);
    if (node === undefined) ctx.error(`cat: ${p}: ${ctx.t('term.noSuch')}`);
    else if (typeof node === 'object') ctx.error(`cat: ${p}: ${ctx.t('term.isDir')}`);
    else {
      ctx.print(node);
      const note = at?.length === 2 && at[0] === 'notes' ? ctx.data.notes[at[1]] : undefined;
      if (note) ctx.print('→ ', { text: note, href: note });
    }
  },
});
