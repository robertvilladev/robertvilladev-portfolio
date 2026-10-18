// Run with `npm run test:unit` (node:test, no framework). fetch is mocked; nothing hits the network.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { load, status, languages, latest, ago, repoName, subject, type GithubData } from './github.ts';

const NOW = Date.parse('2026-10-18T12:00:00Z');
const daysAgo = (d: number) => new Date(NOW - d * 86_400_000).toISOString();
const commit = (sha: string, msg: string, date: string, parents = 1) => ({
  sha, html_url: `https://github.com/o/r/commit/${sha}`, parents: Array(parents).fill({}), commit: { message: msg, committer: { date } },
});

type Route = (url: string) => Response | Promise<Response>;
let calls: { url: string; init: RequestInit }[] = [];
let warnings: string[] = [];
const json = (body: unknown, init?: ResponseInit) => new Response(JSON.stringify(body), init);
const ok: Route = (url) =>
  url.endsWith('/languages') ? json({ TypeScript: 700, Vue: 200, CSS: 50, HTML: 30, Shell: 15, Dockerfile: 5 })
  : url.includes('/commits') ? json([commit('m1', 'Merge pull request #2', daysAgo(1), 2), commit('a1', 'Add thing\n\nbody', daysAgo(2)), commit('b2', 'Fix', daysAgo(9))])
  : json({ pushed_at: daysAgo(1), default_branch: 'main', private: false });

function mock(route: Route) {
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return route(url);
  }) as typeof fetch;
}

beforeEach(() => {
  calls = [];
  warnings = [];
  console.warn = (m: string) => void warnings.push(m);
});

test('success: three requests per repo, merge commits dropped, subject is the first line', async () => {
  mock(ok);
  const data = await load(['o/r'], { GITHUB_TOKEN: 'x' });
  assert.equal(calls.length, 3);
  assert.equal(calls[0].url, 'https://api.github.com/repos/o/r');
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, 'Bearer x');
  assert.ok(calls.every((c) => c.init.signal instanceof AbortSignal));
  const r = data['o/r']!;
  assert.equal(r.pushedAt, daysAgo(1));
  assert.deepEqual(r.commits.map((c) => [c.sha, c.subject]), [['a1', 'Add thing'], ['b2', 'Fix']]);
  assert.deepEqual(warnings, []);
});

test('no token: no Authorization header', async () => {
  mock(ok);
  await load(['o/r'], {});
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, undefined);
});

for (const [name, route] of [
  ['offline', () => Promise.reject(new TypeError('fetch failed'))],
  ['timeout', () => Promise.reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'))],
  ['403 rate limit', () => json({ message: 'API rate limit exceeded' }, { status: 403 })],
  ['404', () => json({ message: 'Not Found' }, { status: 404 })],
  ['bad JSON', () => new Response('<html>')],
] as [string, Route][]) {
  test(`${name}: the repo is null, one warning, other repos unaffected`, async () => {
    mock((url) => (url.includes('/bad') ? route(url) : ok(url)));
    const data = await load(['o/bad', 'o/r'], {});
    assert.equal(data['o/bad'], null);
    assert.ok(data['o/r']);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /o\/bad/);
  });
}

test('a repo GitHub reports as private is dropped', async () => {
  mock((url) => (url.endsWith('/r') ? json({ pushed_at: daysAgo(1), private: true }) : ok(url)));
  assert.equal((await load(['o/r'], {}))['o/r'], null);
});

test('GITHUB_DATA=off makes no requests', async () => {
  mock(ok);
  assert.deepEqual(await load(['o/r'], { GITHUB_DATA: 'off' }), {});
  assert.equal(calls.length, 0);
});

test('status thresholds', () => {
  assert.equal(status(daysAgo(0), NOW), 'running');
  assert.equal(status(daysAgo(29), NOW), 'running');
  assert.equal(status(daysAgo(30), NOW), 'sleeping');
  assert.equal(status(daysAgo(364), NOW), 'sleeping');
  assert.equal(status(daysAgo(365), NOW), 'stopped');
});

test('languages: top 4 by share plus other', () => {
  assert.deepEqual(languages({ TypeScript: 700, Vue: 200, CSS: 50, HTML: 30, Shell: 15, Dockerfile: 5 }), [
    { name: 'TypeScript', pct: 70 }, { name: 'Vue', pct: 20 }, { name: 'CSS', pct: 5 }, { name: 'HTML', pct: 3 }, { name: 'other', pct: 2 },
  ]);
  assert.deepEqual(languages({ Python: 1 }), [{ name: 'Python', pct: 100 }]);
  assert.deepEqual(languages({}), []);
});

test('latest: newest commit across repos, nulls skipped', () => {
  const c = (sha: string, date: string) => ({ sha, subject: sha, date, url: '' });
  const data: GithubData = {
    'o/a': { name: 'o/a', pushedAt: '', languages: [], commits: [c('a', daysAgo(3))] },
    'o/b': { name: 'o/b', pushedAt: '', languages: [], commits: [c('b', daysAgo(1)), c('b0', daysAgo(5))] },
    'o/c': null,
  };
  assert.deepEqual(latest(data), { ...c('b', daysAgo(1)), repo: 'b' });
  assert.equal(latest({}), undefined);
});

test('ago and repoName', () => {
  assert.equal(ago(daysAgo(3), 'en', NOW), '3 days ago');
  assert.equal(ago(daysAgo(1), 'en', NOW), 'yesterday');
  assert.equal(ago(daysAgo(800), 'es', NOW), 'hace 2 años');
  assert.equal(repoName('https://github.com/robertvilladev/gotdle-vue3'), 'robertvilladev/gotdle-vue3');
  assert.equal(repoName('https://github.com/o/r.git'), 'o/r');
});

test('subject: first line, capped at 72 with an ellipsis', () => {
  assert.equal(subject('Fix it\n\nbecause'), 'Fix it');
  assert.equal(subject('x'.repeat(72)), 'x'.repeat(72));
  assert.equal(subject('x'.repeat(80)), `${'x'.repeat(71)}…`);
});
