import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ui, langs, defaultLang, type Lang } from '../src/i18n/ui';

// Notes (018): index, article, RSS and the project link, in every locale.
const slugs = readdirSync('src/content/notes/en').map((f) => f.replace(/\.mdx$/, ''));
const base = (l: Lang) => (l === defaultLang ? '/' : `/${l}/`);

for (const lang of langs) {
  test(`${lang}: the index lists every note and links to it`, async ({ page }) => {
    const res = await page.goto(`${base(lang)}notes/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(ui[lang]['notes.title']);
    const links = page.locator('main ol h2 a');
    await expect(links).toHaveCount(slugs.length);
    await links.first().click();
    await page.waitForURL(`**${base(lang)}notes/${slugs[0]}/`);
    await expect(page.locator('main pre.astro-code').first()).toBeVisible();
  });

  test(`${lang}: the RSS feed is valid XML with one item per note`, async ({ page }) => {
    const res = await page.request.get(`${base(lang)}rss.xml`);
    expect(res.status()).toBe(200);
    const xml = await res.text();
    await page.goto(`${base(lang)}notes/`);
    const feed = await page.evaluate((x) => {
      const doc = new DOMParser().parseFromString(x, 'application/xml');
      return { error: doc.querySelector('parsererror')?.textContent ?? null, items: [...doc.querySelectorAll('item > link')].map((l) => l.textContent), lang: doc.querySelector('channel > language')?.textContent };
    }, xml);
    expect(feed.error).toBeNull();
    expect(feed.lang).toBe(lang);
    expect(feed.items.map((l) => new URL(l!).pathname).sort()).toEqual(slugs.map((s) => `${base(lang)}notes/${s}/`).sort());
    // Every page advertises its locale's feed
    await expect(page.locator('link[rel=alternate][type="application/rss+xml"]')).toHaveAttribute('href', new RegExp(`${base(lang)}rss\.xml$`));
  });

  test(`${lang}: note pages have hreflang alternates for every locale`, async ({ page }) => {
    await page.goto(`${base(lang)}notes/${slugs[0]}/`);
    for (const l of langs) await expect(page.locator(`link[rel=alternate][hreflang=${l}]`)).toHaveAttribute('href', new RegExp(`${base(l)}notes/${slugs[0]}/$`));
  });

  test(`${lang}: the sudoku-2077 project page links to its note`, async ({ page }) => {
    await page.goto(`${base(lang)}projects/sudoku-2077/`);
    await page.locator(`main a[href="${base(lang)}notes/sudoku-difficulty/"]`).click();
    await page.waitForURL(`**${base(lang)}notes/sudoku-difficulty/`);
  });
}

test('code blocks follow the theme, hidden ones included', async ({ page }) => {
  await page.goto(`/notes/${slugs[0]}/`);
  const pre = page.locator('main pre.astro-code').first();
  const colors = async () =>
    pre.evaluate((el) => {
      const keyword = [...el.querySelectorAll('span')].find((s) => s.textContent === 'const')!;
      const root = getComputedStyle(document.documentElement);
      const rgb = (c: string) => Object.assign(document.createElement('i'), { style: `color:${c}` });
      const probe = (c: string) => { const i = rgb(c); document.body.append(i); const v = getComputedStyle(i).color; i.remove(); return v; };
      return { bg: getComputedStyle(el).backgroundColor, keyword: getComputedStyle(keyword).color, surface2: probe(root.getPropertyValue('--surface-2')), accent2: probe(root.getPropertyValue('--accent-2')) };
    });
  const dark = await colors();
  expect(dark.bg).toBe(dark.surface2);
  expect(dark.keyword).toBe(dark.accent2);
  await page.evaluate(() => (document.documentElement.dataset.theme = 'matrix'));
  const matrix = await colors();
  expect(matrix.bg).toBe(matrix.surface2);
  expect(matrix.keyword).toBe(matrix.accent2);
  expect(matrix.keyword).not.toBe(dark.keyword);
});

test.describe('axe', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const path of ['/notes/', `/notes/${slugs[0]}/`]) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });
  }
});
