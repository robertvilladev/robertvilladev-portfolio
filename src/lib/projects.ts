import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, langs, langParam, type Lang } from '@/i18n/ui';
import { github, repoName } from '@/lib/github';

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

/** Repos fetched at build time (009): every public project plus this site. */
export const PORTFOLIO_REPO = 'robertvilladev/robertvilladev-portfolio';
export const githubData = async () =>
  github([...(await getProjects(defaultLang)).filter((p) => !p.data.private).map((p) => repoName(p.data.repo)), PORTFOLIO_REPO]);

/** A project's GitHub data, or null (private, offline, `GITHUB_DATA=off`). */
export const repoData = async ({ data }: Project) => (data.private ? null : ((await githubData())[repoName(data.repo)] ?? null));
