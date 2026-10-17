import { register } from '../core';
import { themes } from '@/scripts/theme';

register({
  name: 'theme',
  man: 'term.man.theme',
  complete: () => themes,
  run({ args: [name] }, ctx) {
    if (name && !themes.includes(name)) return ctx.usage();
    if (name) ctx.setTheme(name);
    ctx.print(`${ctx.t('theme.name')}: ${document.documentElement.dataset.theme}`);
  },
});
