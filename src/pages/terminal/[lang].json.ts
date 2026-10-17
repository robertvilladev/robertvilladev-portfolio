// /terminal/<lang>.json: everything the terminal needs, built from site content and fetched on first open.
import { getRelativeLocaleUrl } from 'astro:i18n';
import { site } from '@/config';
import { career } from '@/data/career';
import { getProjects, slugOf } from '@/lib/projects';
import { langs, ui, type Lang } from '@/i18n/ui';
import type { Dir, TermData } from '@/scripts/terminal/core';

export const getStaticPaths = () => langs.map((lang) => ({ params: { lang } }));

// ui.ts keys the terminal reads: its own plus a few shared with the page.
const shared = ['term.', '404.', 'hero.role', 'lang.egg', 'theme.name'];

export async function GET({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const t = ui[lang];
  const links = { github: site.github, linkedin: site.linkedin };
  const projects: TermData['projects'] = {};
  const dirs: Dir = {};

  for (const p of await getProjects(lang)) {
    const slug = slugOf(p);
    const { title, summary, stack, repo, demo } = p.data;
    projects[slug] = { title, url: getRelativeLocaleUrl(lang, `projects/${slug}`), repo, demo };
    dirs[slug] = {
      'README.md': [`# ${title}`, summary, p.body?.trim(), `${t['project.stack']}: ${stack.join(' · ')}\nrepo: ${repo}${demo ? `\ndemo: ${demo}` : ''}`]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  const fs: Dir = {
    'about.md': `# ${t['about.title.a']} ${t['about.title.b']}.\n\n${t['about.body']}\n\n${site.stack}`,
    'career.log': career.map((c) => `* ${c.hash} (${c.period[lang]}) ${c.role[lang]}\n  ${c.note[lang]}`).join('\n\n'),
    contact: [site.email && `email     ${site.email}`, ...Object.entries(links).map(([k, v]) => `${k.padEnd(9)} ${v}`)].filter(Boolean).join('\n'),
    projects: dirs,
  };

  const data: TermData = {
    lang,
    home: getRelativeLocaleUrl(lang),
    name: site.name,
    role: t['meta.jobTitle'],
    email: site.email,
    links,
    since: Number(career.at(-1)!.period.en.slice(0, 4)),
    stack: site.stack,
    strings: Object.fromEntries(Object.entries(t).filter(([k]) => shared.some((s) => k.startsWith(s)))),
    fs,
    projects,
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
