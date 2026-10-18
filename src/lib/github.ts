// GitHub data fetched once at build time (009). Never fails the build: a repo that can't be
// fetched is null and the page falls back to its static markup. No imports, so `node --test` runs it.

export interface Commit { sha: string; subject: string; date: string; url: string }
export interface Language { name: string; pct: number }
export interface Repo { name: string; pushedAt: string; languages: Language[]; commits: Commit[] }
/** Keyed by `owner/name`; null when the fetch failed. */
export type GithubData = Record<string, Repo | null>;

const DAY = 86_400_000;

/** `owner/name` from a repo URL. */
export const repoName = (url: string) => new URL(url).pathname.replace(/^\/|\/$|\.git$/g, '');

/** A commit message's first line, capped at 72 characters. */
export function subject(message: string) {
  const line = message.split('\n')[0];
  return line.length > 72 ? `${line.slice(0, 71)}…` : line;
}

/** ps-style status from the last push. */
export function status(pushedAt: string, now = Date.now()) {
  const age = now - Date.parse(pushedAt);
  return age < 30 * DAY ? 'running' : age < 365 * DAY ? 'sleeping' : 'stopped';
}

/** Byte counts → top 4 languages by share, the rest summed as `other`. */
export function languages(bytes: Record<string, number>): Language[] {
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  if (!total) return [];
  const sorted = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
  const rest = sorted.slice(4).reduce((a, [, b]) => a + b, 0);
  const top = sorted.slice(0, 4).map(([name, b]) => ({ name, pct: Math.round((b / total) * 100) }));
  return rest ? [...top, { name: 'other', pct: Math.round((rest / total) * 100) }] : top;
}

/** The newest commit across repos, with the repo it came from. */
export function latest(data: GithubData) {
  let best: (Commit & { repo: string }) | undefined;
  for (const r of Object.values(data))
    for (const c of r?.commits ?? []) if (!best || c.date > best.date) best = { ...c, repo: r!.name.split('/')[1] };
  return best;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [['year', 365 * DAY], ['month', 30 * DAY], ['week', 7 * DAY], ['day', DAY], ['hour', 3_600_000], ['minute', 60_000]];

/** "3 days ago" in `lang`. */
export function ago(date: string, lang: string, now = Date.now()) {
  const ms = now - Date.parse(date);
  const [unit, size] = UNITS.find(([, s]) => ms >= s) ?? ['minute', 60_000];
  return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(-Math.floor(ms / size), unit);
}

async function get(path: string, headers: Record<string, string>) {
  const res = await fetch(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function repo(name: string, headers: Record<string, string>): Promise<Repo | null> {
  try {
    const [info, langs, commits] = await Promise.all([
      get(`repos/${name}`, headers),
      get(`repos/${name}/languages`, headers),
      get(`repos/${name}/commits?per_page=10`, headers),
    ]);
    if (info.private) return null; // content says public, GitHub says private: never show it
    return {
      name,
      pushedAt: info.pushed_at,
      languages: languages(langs),
      commits: commits
        .filter((c: any) => c.parents.length <= 1)
        .map((c: any) => ({ sha: c.sha, subject: subject(c.commit.message), date: c.commit.committer.date, url: c.html_url })),
    };
  } catch (e) {
    console.warn(`[github] ${name}: ${(e as Error).message}, building without its data`);
    return null;
  }
}

/** Fetches every repo in parallel. `GITHUB_DATA=off` skips the network. */
export async function load(names: string[], env = process.env): Promise<GithubData> {
  if (env.GITHUB_DATA === 'off') return {};
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'robertvilladev-portfolio' };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return Object.fromEntries(await Promise.all(names.map(async (n) => [n, await repo(n, headers)])));
}

let cache: Promise<GithubData> | undefined;
/** One fetch per build process, shared by every page. */
export const github = (names: string[]) => (cache ??= load(names));
