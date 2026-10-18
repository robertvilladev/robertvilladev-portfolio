import { getCollection, type CollectionEntry } from 'astro:content';
import { langs, langParam, type Lang } from '@/i18n/ui';
import { slugOf } from '@/lib/projects';

export type Note = CollectionEntry<'notes'>;

/** A locale's published notes, newest first. */
export async function getNotes(lang: Lang) {
  const all = await getCollection('notes', (n) => n.id.startsWith(`${lang}/`) && !n.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Every note page in every language, for `[...lang]/notes/[slug]`. */
export async function notePaths() {
  const perLang = await Promise.all(
    langs.map(async (lang) => (await getNotes(lang)).map((entry) => ({ params: { lang: langParam(lang), slug: slugOf(entry) }, props: { lang, entry } }))),
  );
  return perLang.flat();
}

export const formatDate = (d: Date, lang: Lang) => d.toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
