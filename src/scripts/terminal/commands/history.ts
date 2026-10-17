import { register } from '../core';

register({
  name: 'history',
  man: 'term.man.history',
  run: (_, ctx) => void ctx.print(ctx.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n')),
});
