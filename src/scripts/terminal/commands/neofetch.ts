import { register } from '../core';

const art = ['▄▄▄▄▄▄▄▄▄', '█       █', '█  >_   █', '█       █', '▀▀▀▀▀▀▀▀▀'];

register({
  name: 'neofetch',
  man: 'term.man.neofetch',
  run(_, { data, t, print }) {
    const row = (k: string, v: string) => `${t(k).padEnd(11)} ${v}`;
    const info = [
      'robert@villa',
      '------------',
      row('term.nf.role', data.role),
      row('term.nf.stack', data.stack),
      row('term.nf.coding', `${new Date().getFullYear() - data.since}+ ${t('term.nf.years')}`),
      row('term.nf.langs', 'en · es · ca'),
      t('lang.egg'),
    ];
    print(info.map((line, i) => `${(art[i] ?? '').padEnd(11)}${line}`).join('\n'));
  },
});
