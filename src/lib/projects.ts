import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

export const slugOf = (p: Project) => p.id.split('/').slice(1).join('/');

export async function getProjects(lang: Lang) {
  const all = await getCollection('projects', (p) => p.id.startsWith(`${lang}/`) && !p.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function projectPaths(lang: Lang) {
  return (await getProjects(lang)).map((entry) => ({ params: { slug: slugOf(entry) }, props: { entry } }));
}
