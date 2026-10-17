import { readdirSync } from 'node:fs';
import { sep } from 'node:path';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { defaultLang, langs } from '../src/i18n/ui';

// Every page in the build: dist/es/projects/foo/index.html -> /es/projects/foo/
const routes = readdirSync('dist', { recursive: true, encoding: 'utf8' })
  .map((f) => f.replaceAll(sep, '/'))
  .filter((f) => f === 'index.html' || f.endsWith('/index.html'))
  .map((f) => '/' + f.replace(/index\.html$/, ''))
  .map((path) => {
    const seg = path.split('/')[1] as (typeof langs)[number];
    return { path, lang: langs.includes(seg) ? seg : defaultLang };
  });
const homes = langs.map((lang) => (lang === defaultLang ? '/' : `/${lang}/`));
const projectPage = routes.find((r) => r.lang === defaultLang && r.path.startsWith('/projects/'))!.path;

test('every locale has a home and the same pages as the default locale', () => {
  const count = (lang: string) => routes.filter((r) => r.lang === lang).length;
  for (const home of homes) expect(routes.map((r) => r.path)).toContain(home);
  for (const lang of langs) expect(count(lang), lang).toBe(count(defaultLang));
});

for (const { path, lang } of routes) {
  test(`${path} returns 200 with lang=${lang}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
  });

  test(`${path} has no horizontal overflow at 375px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(path);
    const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    expect(scroll).toBeLessThanOrEqual(width);
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const home of homes) {
    test(`${home} shows every section`, async ({ page }) => {
      await page.goto(home);
      for (const id of ['about', 'projects', 'log', 'contact']) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        await expect(section).toBeVisible();
        expect(Number(await section.evaluate((el) => getComputedStyle(el).opacity)), id).toBeGreaterThan(0);
      }
    });
  }
});

// Scan the settled page: mid-animation opacity makes contrast results flaky.
test.describe('axe', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const path of ['/', projectPage]) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });
  }
});
