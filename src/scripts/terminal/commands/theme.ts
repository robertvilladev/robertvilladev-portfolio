import { register } from '../core';
import { themes, themeNames } from '@/lib/themes';

const visible = themes.filter((t) => !t.hidden).map((t) => t.name).join(' ');

register({
  name: 'theme',
  man: 'term.man.theme',
  complete: () => themeNames,
  run({ args: [name] }, ctx) {
    if (name && !themeNames.includes(name)) return ctx.usage();
    if (name) ctx.setTheme(name);
    ctx.print(`${ctx.t('theme.name')}: ${document.documentElement.dataset.theme}`);
    if (!name) ctx.print(`${visible}  ${ctx.t('term.theme.more')}`);
  },
});
