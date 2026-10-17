import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLang, langs } from './src/i18n/ui';

export default defineConfig({
  site: 'https://robertvilla.dev',
  i18n: {
    defaultLocale: defaultLang,
    locales: langs,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: defaultLang, locales: Object.fromEntries(langs.map((l) => [l, l])) } })],
});
