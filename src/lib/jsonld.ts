import { site } from '@/config';
import { langs, t as useT, type Lang } from '@/i18n/ui';
import type { Project } from '@/lib/projects';

const personId = (origin: URL) => new URL('/#person', origin).href;

export function personLd(lang: Lang, origin: URL, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(origin),
    name: site.name,
    url,
    ...(site.email && { email: site.email }),
    jobTitle: useT(lang)('meta.jobTitle'),
    sameAs: [site.github, site.linkedin].filter(Boolean),
    knowsLanguage: langs,
  };
}

export function projectLd(lang: Lang, origin: URL, url: string, { data }: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: data.title,
    description: data.summary,
    url,
    codeRepository: data.repo,
    keywords: data.stack,
    inLanguage: lang,
    author: { '@id': personId(origin) },
  };
}
