// One feed per locale (018): /rss.xml, /es/rss.xml, /ca/rss.xml.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { site } from '@/config';
import { getNotes } from '@/lib/notes';
import { slugOf } from '@/lib/projects';
import { langs, langParam, t as useT, type Lang } from '@/i18n/ui';

export const getStaticPaths = () => langs.map((lang) => ({ params: { lang: langParam(lang) }, props: { lang } }));

export async function GET({ props, site: origin }: APIContext<{ lang: Lang }>) {
  const { lang } = props;
  const t = useT(lang);
  return rss({
    title: `${site.name} · ${t('notes.title')}`,
    description: t('notes.description'),
    site: new URL(getRelativeLocaleUrl(lang, 'notes'), origin).href,
    items: (await getNotes(lang)).map((n) => ({
      title: n.data.title,
      description: n.data.summary,
      pubDate: n.data.date,
      categories: n.data.tags,
      link: getRelativeLocaleUrl(lang, `notes/${slugOf(n)}`),
    })),
    customData: `<language>${lang}</language>`,
  });
}
