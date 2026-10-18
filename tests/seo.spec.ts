import { readdirSync, readFileSync } from 'node:fs';
import { sep } from 'node:path';
import { test, expect } from '@playwright/test';
import { defaultLang, langs } from '../src/i18n/ui';
import { site } from '../src/config';
import { privateSlugs } from './projects';

// Reads the built HTML directly: JSON-LD and meta are static, no browser needed.
const pages = readdirSync('dist', { recursive: true, encoding: 'utf8' })
  .map((f) => f.replaceAll(sep, '/'))
  .filter((f) => f.endsWith('index.html'))
  .map((f) => {
    const html = readFileSync(`dist/${f}`, 'utf8');
    const path = '/' + f.replace(/index\.html$/, '');
    const seg = path.split('/')[1] as (typeof langs)[number];
    const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
    return {
      path,
      lang: langs.includes(seg) ? seg : defaultLang,
      title: html.match(/<title>(.*?)<\/title>/s)?.[1],
      description: html.match(/<meta name="description" content="(.*?)"/s)?.[1],
      ld,
      meta: (prop: string) => html.match(new RegExp(`<meta (?:property|name)="${prop}" content="(.*?)"`))?.[1],
    };
  });
const homes = pages.filter((p) => p.path === '/' || /^\/(es|ca)\/$/.test(p.path));
const projectPages = pages.filter((p) => p.path.includes('/projects/'));

test('every locale has a home and project pages to check', () => {
  expect(homes.map((h) => h.lang).sort()).toEqual([...langs].sort());
  expect(projectPages.length).toBeGreaterThan(0);
});

for (const h of homes) {
  test(`${h.path} has a valid Person JSON-LD`, () => {
    expect(h.ld).toHaveLength(1);
    const [p] = h.ld;
    expect(p).toMatchObject({ '@context': 'https://schema.org', '@type': 'Person', name: site.name, email: site.email, knowsLanguage: langs });
    expect(p.jobTitle).toBeTruthy();
    expect(p.sameAs).toEqual([site.github, site.linkedin]);
    expect(p['@id']).toMatch(/^https:\/\/.+\/#person$/);
  });
}

for (const p of projectPages) {
  test(`${p.path} has a valid SoftwareSourceCode JSON-LD`, () => {
    expect(p.ld).toHaveLength(1);
    const [ld] = p.ld;
    expect(ld).toMatchObject({ '@type': 'SoftwareSourceCode', inLanguage: p.lang, author: { '@id': homes[0].ld[0]['@id'] } });
    for (const k of ['name', 'description', 'url']) expect(ld[k], k).toBeTruthy();
    if (privateSlugs.some((s) => p.path.endsWith(`/projects/${s}/`))) expect(ld.codeRepository).toBeUndefined();
    else expect(ld.codeRepository).toMatch(/^https:\/\//);
    expect(ld.keywords.length).toBeGreaterThan(0);
  });
}

test('robots.txt points at the sitemap', () => {
  expect(readFileSync('dist/robots.txt', 'utf8')).toMatch(/^Sitemap: https:\/\/.+\/sitemap-index\.xml$/m);
  expect(readdirSync('dist')).toContain('sitemap-index.xml');
});

test('every page has a title and description, unique within its locale', () => {
  for (const lang of langs) {
    const own = pages.filter((p) => p.lang === lang && p.path !== '/404.html');
    for (const key of ['title', 'description'] as const) {
      const vals = own.map((p) => p[key]);
      expect(vals.every(Boolean), `${lang} ${key} present`).toBe(true);
      expect(new Set(vals).size, `${lang} ${key} unique`).toBe(vals.length);
    }
  }
  const homeTitles = homes.map((h) => h.title);
  expect(new Set(homeTitles).size).toBe(langs.length);
  expect(new Set(homes.map((h) => h.description)).size).toBe(langs.length);
});

test('every page has an og:image pointing at an existing 1200x630 file', () => {
  for (const p of pages) {
    const img = p.meta('og:image')!;
    expect(img, p.path).toMatch(/^https:\/\/.+\.png$/);
    const file = readFileSync('dist' + new URL(img).pathname);
    expect([file.readUInt32BE(16), file.readUInt32BE(20)], img).toEqual([1200, 630]);
    expect(p.meta('og:image:alt'), p.path).toBeTruthy();
    expect(p.meta('twitter:card'), p.path).toBe('summary_large_image');
  }
  // 404 falls back to the home card
  expect(readFileSync('dist/404.html', 'utf8')).toMatch(/og:image" content="[^"]*\/og\/en\/home\.png"/);
});
