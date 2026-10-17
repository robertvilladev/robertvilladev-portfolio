import { register } from '../core';

register({
  name: 'whoami',
  man: 'term.man.whoami',
  run: (_, ctx) => void ctx.print(`${ctx.data.name}\n${ctx.t('hero.role')}`),
});
