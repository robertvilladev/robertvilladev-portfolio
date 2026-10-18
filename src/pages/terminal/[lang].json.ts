// /terminal/<lang>.json: everything the terminal needs, built from site content and fetched on first open.
import { getRelativeLocaleUrl } from 'astro:i18n';
import { site } from '@/config';
import { career } from '@/data/career';
import { getProjects, githubData, repoData, slugOf, PORTFOLIO_REPO } from '@/lib/projects';
import { getNotes } from '@/lib/notes';
import { ago, type Repo } from '@/lib/github';
import { langs, ui, type Lang } from '@/i18n/ui';
import type { Dir, TermData } from '@/scripts/terminal/core';

export const getStaticPaths = () => langs.map((lang) => ({ params: { lang } }));

// ui.ts keys the terminal reads: its own plus a few shared with the page.
const shared = ['term.', '404.', 'hero.role', 'lang.egg', 'theme.name', 'projects.private'];

export async function GET({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const t = ui[lang];
  const links = { github: site.github, linkedin: site.linkedin };
  const projects: TermData['projects'] = {};
  const dirs: Dir = {};
  const log: TermData['log'] = [];
  const commits = (p: string, repo: Repo | null | undefined) =>
    repo?.commits.slice(0, 3).forEach((c) => log.push({ p, s: c.subject, url: c.url, when: c.date }));

  for (const p of await getProjects(lang)) {
    const slug = slugOf(p);
    const { title, summary, stack, demo } = p.data;
    const repo = p.data.private ? undefined : p.data.repo;
    projects[slug] = { title, url: getRelativeLocaleUrl(lang, `projects/${slug}`), repo, demo };
    commits(slug, await repoData(p));
    dirs[slug] = {
      'README.md': [`# ${title}`, summary, p.body?.trim(), `${t['project.stack']}: ${stack.join(' · ')}\nrepo: ${repo ?? t['projects.private']}${demo ? `\ndemo: ${demo}` : ''}`]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  // Notes (018): title and summary only; `cat` adds the link from `notes`.
  const notes: TermData['notes'] = {};
  const noteFiles: Dir = {};
  for (const n of await getNotes(lang)) {
    notes[slugOf(n)] = getRelativeLocaleUrl(lang, `notes/${slugOf(n)}`);
    noteFiles[slugOf(n)] = `# ${n.data.title}

${n.data.summary}`;
  }

  commits('portfolio', (await githubData())[PORTFOLIO_REPO]);
  log.sort((a, b) => b.when.localeCompare(a.when));
  for (const c of log) c.when = ago(c.when, lang);

  const fs: Dir = {
    'about.md': `# ${t['about.title.a']} ${t['about.title.b']}.\n\n${t['about.body']}\n\n${site.stack}`,
    'career.log': career.map((c) => `* ${c.hash} (${c.period[lang]}) ${c.role[lang]}\n  ${c.note[lang]}`).join('\n\n'),
    contact: [site.email && `email     ${site.email}`, ...Object.entries(links).map(([k, v]) => `${k.padEnd(9)} ${v}`)].filter(Boolean).join('\n'),
    projects: dirs,
    notes: noteFiles,
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
    notes,
    log,
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
