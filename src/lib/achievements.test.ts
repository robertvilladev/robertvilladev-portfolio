// Run with `npm run test:unit` (node:test, no framework). localStorage is a Map-backed stub.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const store = new Map<string, string>();
let blocked = false;
const guard = () => { if (blocked) throw new Error('SecurityError'); };
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k: string) => (guard(), store.get(k) ?? null),
    setItem: (k: string, v: string) => (guard(), void store.set(k, v)),
  },
});

const { ids, load, unlock, click, collect, reset, onUnlock } = await import('./achievements.ts');
let seen: [string, number][] = [];
onUnlock((id, n) => seen.push([id, n]));

beforeEach(() => {
  blocked = false;
  store.clear();
  reset();
  seen = [];
});

test('unlock stores a timestamp and reports the count', () => {
  unlock('terminal');
  assert.ok(JSON.parse(store.get('ach')!).unlocked.terminal > 0);
  assert.deepEqual(seen, [['terminal', 1]]);
});

test('a repeat unlock does nothing', () => {
  unlock('root');
  const first = load().unlocked.root;
  unlock('root');
  assert.equal(load().unlocked.root, first);
  assert.deepEqual(seen, [['root', 1]]);
});

test('completionist unlocks once the other 11 are done', () => {
  for (const id of ids.slice(0, -2)) unlock(id);
  assert.equal(load().unlocked.completionist, undefined);
  unlock(ids.at(-2)!);
  assert.deepEqual(seen.slice(-2), [[ids.at(-2), 11], ['completionist', 12]]);
});

test('clicks count up to 100, then clicker unlocks and counting stops', () => {
  for (let i = 0; i < 99; i++) click();
  assert.equal(load().clicks, 99);
  assert.equal(seen.length, 0);
  click();
  click();
  assert.deepEqual(seen, [['clicker', 1]]);
  assert.equal(load().clicks, 100);
});

test('themes: each hidden theme counts once; all four unlock chromatic', () => {
  const hidden = ['matrix', 'amber', 'synthwave', 'night-city'];
  for (const t of ['matrix', 'matrix', 'amber', 'synthwave']) collect('themes', t, hidden, 'chromatic');
  assert.deepEqual(load().themes, ['matrix', 'amber', 'synthwave']);
  assert.equal(seen.length, 0);
  collect('themes', 'night-city', hidden, 'chromatic');
  assert.deepEqual(seen, [['chromatic', 1]]);
});

test('explorer: every project in any order; langs and projects are separate sets', () => {
  const all = ['gotdle', 'sudoku-2077'];
  collect('langs', 'en', ['en', 'es', 'ca'], 'polyglot');
  collect('projects', 'sudoku-2077', all, 'explorer');
  assert.deepEqual(load().visited, { langs: ['en'], projects: ['sudoku-2077'] });
  collect('projects', 'gotdle', all, 'explorer');
  assert.deepEqual(seen, [['explorer', 1]]);
});

test('blocked storage keeps state in memory and never throws', () => {
  const before = store.get('ach');
  blocked = true;
  unlock('lost');
  unlock('lost');
  assert.deepEqual(seen, [['lost', 1]]);
  assert.equal(store.get('ach'), before);
});

test('reset wipes everything', () => {
  unlock('hire');
  click();
  reset();
  assert.deepEqual(load(), { unlocked: {}, clicks: 0, visited: { langs: [], projects: [] }, themes: [] });
});
