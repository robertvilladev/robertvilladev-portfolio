import { register } from '../core';

register({
  name: 'open',
  man: 'term.man.open',
  complete: (_, ctx) => Object.keys(ctx.data.projects),
  run({ args: [arg], flags }, ctx) {
    // `open gotdle`, `open projects/gotdle/`, or a bare `open` from inside ~/projects/<slug>.
    const slug = arg?.split('/').filter(Boolean).at(-1) ?? (ctx.cwd[0] === 'projects' ? ctx.cwd[1] : undefined);
    if (!slug) return ctx.usage();
    const p = Object.hasOwn(ctx.data.projects, slug) ? ctx.data.projects[slug] : undefined;
    if (!p) return ctx.error(`open: ${ctx.t('term.noSuch')}: ${arg}`);
    if (flags.has('repo') || flags.has('demo')) {
      const url = flags.has('demo') ? p.demo : p.repo;
      if (!url) return ctx.error(`open: ${slug}: ${ctx.t(flags.has('demo') ? 'term.noDemo' : 'term.noRepo')}`);
      ctx.print(`${ctx.t('term.opening')} `, { text: url, href: url });
      ctx.openTab(url);
    } else {
      ctx.print(`${ctx.t('term.opening')} ${p.title}…`);
      ctx.navigate(p.url);
    }
  },
});
