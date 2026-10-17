import { paths, register, stat, type Dir } from '../core';

register({
  name: 'tree',
  man: 'term.man.tree',
  complete: (w, ctx) => paths(ctx.fs, ctx.cwd, w, true),
  run({ args: [p = '.'] }, ctx) {
    const { node } = stat(ctx.fs, ctx.cwd, p);
    if (typeof node !== 'object') return ctx.error(`tree: ${ctx.t(node === undefined ? 'term.noSuch' : 'term.notDir')}: ${p}`);
    const lines = [p];
    const walk = (dir: Dir, indent: string) =>
      Object.entries(dir).forEach(([name, n], i, all) => {
        const last = i === all.length - 1;
        lines.push(`${indent}${last ? '└── ' : '├── '}${name}${typeof n === 'object' ? '/' : ''}`);
        if (typeof n === 'object') walk(n, indent + (last ? '    ' : '│   '));
      });
    walk(node, '');
    ctx.print(lines.join('\n'));
  },
});
