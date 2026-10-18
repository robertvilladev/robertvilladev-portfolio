// WCAG AA contrast for every theme block in tokens.css (014). Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { themeNames } from '../lib/themes.ts';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
/** Theme name → token → value. Dark is the bare `:root` block. */
const blocks = new Map(
  [...css.matchAll(/:root(?:\[data-theme='([\w-]+)'\])?\s*\{([^}]*)\}/g)].map(([, name = 'dark', body]) => [
    name,
    Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()])),
  ]),
);

const luminance = (hex: string) => {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi)!.map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const fg = ['--text', '--body', '--muted', '--accent', '--accent-2', '--hash'];
const bg = ['--bg', '--bg-2', '--surface'];
/** Pairs that failed before 014 and are kept as designed (`theme fg bg`). None today. */
const exempt = new Set<string>([]);

test('every theme in themes.ts has a block in tokens.css, defining every color token', () => {
  const tokens = Object.keys(blocks.get('dark')!).filter((k) => !k.startsWith('--font') && /^#|^rgb/.test(blocks.get('dark')![k]));
  for (const name of themeNames) {
    assert.ok(blocks.has(name), `no :root block for ${name}`);
    for (const k of tokens) assert.ok(blocks.get(name)![k], `${name} is missing ${k}`);
  }
});

for (const name of themeNames) {
  test(`${name}: text and accents are ≥ 4.5:1`, () => {
    const v = blocks.get(name)!;
    const pairs = [...fg.flatMap((f) => bg.map((b) => [f, b])), ['--on-accent', '--accent']];
    const fails = pairs
      .filter(([f, b]) => !exempt.has(`${name} ${f} ${b}`))
      .map(([f, b]) => [f, b, contrast(v[f], v[b])] as const)
      .filter(([, , r]) => r < 4.5)
      .map(([f, b, r]) => `${f} on ${b}: ${r.toFixed(2)}`);
    assert.deepEqual(fails, []);
  });
}
