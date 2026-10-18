import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defaultLang, langs } from './src/i18n/ui';

export default defineConfig({
  site: 'https://robertvilla.dev',
  i18n: {
    defaultLocale: defaultLang,
    locales: langs,
    routing: { prefixDefaultLocale: false },
  },
  // Code colors come from --astro-code-* variables, mapped to the theme tokens in global.css (018).
  markdown: { shikiConfig: { theme: 'css-variables' } },
  integrations: [mdx(), sitemap({ i18n: { defaultLocale: defaultLang, locales: Object.fromEntries(langs.map((l) => [l, l])) } })],
});
