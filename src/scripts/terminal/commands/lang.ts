import { register } from '../core';

// The header's language links already point at this page in every locale (getRelativeLocaleUrl).
const links = () => [...document.querySelectorAll<HTMLAnchorElement>('header a[hreflang]')];

register({
  name: 'lang',
  man: 'term.man.lang',
  complete: () => links().map((a) => a.hreflang),
  run({ args: [lang] }, ctx) {
    const a = links().find((a) => a.hreflang === lang);
    if (!a) return ctx.usage();
    ctx.print(`lang: ${lang}`);
    ctx.navigate(a.href);
  },
});
