// Run with `npm run test:unit` (node:test, no framework).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, resolve, paths, complete, distance, suggest, pathString, type Dir } from './core.ts';

const fs: Dir = {
  'about.md': '# about',
  'career.log': 'log',
  projects: { gotdle: { 'README.md': 'g' }, 'gotdle-api': { 'README.md': 'a' }, sudoku: { 'README.md': 's' } },
};

test('parse: name, args, long and short flags, quotes', () => {
  const a = parse('  open gotdle --repo ');
  assert.equal(a.name, 'open');
  assert.deepEqual(a.args, ['gotdle']);
  assert.deepEqual([...a.flags], ['repo']);
  assert.deepEqual([...parse('rm -rf /').flags], ['r', 'f']);
  assert.deepEqual(parse('rm -rf /').args, ['/']);
  assert.deepEqual(parse(`cat "my file" 'it is' "--not-a-flag"`).args, ['my file', 'it is', '--not-a-flag']);
  assert.equal(parse('').name, '');
  assert.equal(parse('"quoted cmd" x').name, 'quoted cmd');
});

test('resolve: relative, ~, /, .., files, missing', () => {
  assert.deepEqual(resolve(fs, [], 'projects/gotdle'), ['projects', 'gotdle']);
  assert.deepEqual(resolve(fs, ['projects', 'gotdle'], '..'), ['projects']);
  assert.deepEqual(resolve(fs, ['projects'], '../../..'), []);
  assert.deepEqual(resolve(fs, ['projects'], '~'), []);
  assert.deepEqual(resolve(fs, ['projects'], '/about.md'), ['about.md']);
  assert.deepEqual(resolve(fs, ['projects'], './sudoku/'), ['projects', 'sudoku']);
  assert.deepEqual(resolve(fs, ['projects']), ['projects']);
  assert.equal(resolve(fs, [], 'nope'), null);
  assert.equal(resolve(fs, [], 'about.md/x'), null);
  assert.equal(resolve(fs, [], 'constructor'), null);
  assert.equal(pathString(['projects', 'gotdle']), '~/projects/gotdle');
  assert.equal(pathString([]), '~');
});

test('paths: lists the typed dir, dirs get a slash', () => {
  assert.deepEqual(paths(fs, [], ''), ['about.md', 'career.log', 'projects/']);
  assert.deepEqual(paths(fs, [], 'projects/go'), ['projects/gotdle/', 'projects/gotdle-api/', 'projects/sudoku/']);
  assert.deepEqual(paths(fs, [], '', true), ['projects/']);
  assert.deepEqual(paths(fs, ['projects'], '~/a'), ['~/about.md', '~/career.log', '~/projects/']);
  assert.deepEqual(paths(fs, [], 'about.md/'), []);
});

test('complete: single match, common prefix, no match, nested paths', () => {
  const names = ['cat', 'cd', 'clear', 'ls'];
  const cand = (w: string[]) => (w.length === 1 ? names : paths(fs, [], w.at(-1)!));
  assert.deepEqual(complete('l', cand), { line: 'ls ', options: [] });
  assert.deepEqual(complete('c', cand), { line: 'c', options: ['cat', 'cd', 'clear'] });
  assert.deepEqual(complete('cl', cand), { line: 'clear ', options: [] });
  assert.deepEqual(complete('cd pro', cand), { line: 'cd projects/', options: [] });
  assert.deepEqual(complete('cd projects/go', cand), { line: 'cd projects/gotdle', options: ['projects/gotdle/', 'projects/gotdle-api/'] });
  assert.deepEqual(complete('cat projects/s', cand), { line: 'cat projects/sudoku/', options: [] });
  assert.deepEqual(complete('x', cand), { line: 'x', options: [] });
});

test('distance and suggest', () => {
  assert.equal(distance('kitten', 'sitting'), 3);
  assert.equal(distance('', 'abc'), 3);
  assert.equal(distance('help', 'help'), 0);
  const names = ['help', 'ls', 'cd', 'cat', 'clear', 'history', 'neofetch'];
  assert.equal(distance('sl', 'ls'), 1);
  assert.equal(suggest('hlep', names), 'help');
  assert.equal(suggest('hepl', names), 'help');
  assert.equal(suggest('cx', names), 'cd');
  assert.equal(suggest('xyz', names), undefined);
  assert.equal(suggest('helo', names), 'help');
  assert.equal(suggest('histroy', names), 'history');
  assert.equal(suggest('neofech', names), 'neofetch');
  assert.equal(suggest('sl', names), 'ls');
  assert.equal(suggest('zzzz', names), undefined);
});
