import { register } from '../core';

register({
  name: 'git',
  man: 'term.man.git',
  complete: (_, ctx, words) => (words.length === 2 ? ['log'] : words.length === 3 && words[1] === 'log' ? [...Object.keys(ctx.data.projects), 'portfolio'] : []),
  run({ args: [sub, arg] }, ctx) {
    if (sub !== 'log') return ctx.usage();
    // `git log gotdle`, `git log projects/gotdle/`, or a bare `git log` (inside ~/projects/<slug>: that project).
    const p = arg?.split('/').filter(Boolean).at(-1) ?? (ctx.cwd[0] === 'projects' ? ctx.cwd[1] : undefined);
    if (p && !Object.hasOwn(ctx.data.projects, p) && p !== 'portfolio') return ctx.error(`git: ${ctx.t('term.noSuch')}: ${arg}`);
    const log = ctx.data.log.filter((c) => !p || c.p === p).slice(0, 10);
    if (!log.length) return ctx.error(`git log${p ? ` ${p}` : ''}: ${ctx.t('term.git.none')}`);
    for (const c of log) ctx.print({ text: c.url.slice(-40, -33), href: c.url }, ` ${p ? '' : `(${c.p}) `}${c.s} · ${c.when}`);
  },
});
