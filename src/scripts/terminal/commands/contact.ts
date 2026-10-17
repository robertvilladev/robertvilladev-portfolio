import { register } from '../core';

register({
  name: 'contact',
  man: 'term.man.contact',
  run: (_, ctx) => void ctx.print(String(ctx.fs.contact)),
});

register({
  name: 'email',
  man: 'term.man.email',
  run(_, ctx) {
    const { email } = ctx.data;
    if (!email) return void ctx.print(String(ctx.fs.contact));
    ctx.print(`${ctx.t('term.opening')} `, { text: email, href: `mailto:${email}` });
    ctx.navigate(`mailto:${email}`);
  },
});
