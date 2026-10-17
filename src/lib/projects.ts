import { getCollection, type CollectionEntry } from 'astro:content';
import { langs, langParam, type Lang } from '@/i18n/ui';

export type Project = CollectionEntry<'projects'>;

export const slugOf = (p: Project) => p.id.split('/').slice(1).join('/');

export async function getProjects(lang: Lang) {
  const all = await getCollection('projects', (p) => p.id.startsWith(`${lang}/`) && !p.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Every project page in every language, for `[...lang]/projects/[slug]`. */
export async function projectPaths() {
  const perLang = await Promise.all(
    langs.map(async (lang) =>
      (await getProjects(lang)).map((entry) => ({ params: { lang: langParam(lang), slug: slugOf(entry) }, props: { lang, entry } })),
    ),
  );
  return perLang.flat();
}
