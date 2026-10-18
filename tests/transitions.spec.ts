import { test, expect, type Page } from '@playwright/test';

// Chromium sometimes drops a transition when many workers load pages at once, so retry.
test.describe.configure({ retries: 3 });

// Records what a cross-document view transition actually did, once it is ready.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    addEventListener('pagereveal', (e) => {
      e.viewTransition?.ready.then(() => {
        const groups = new Map<string, Set<string>>();
        for (const a of document.getAnimations()) {
          const m = /::view-transition-(group|old|new)\((.+)\)/.exec((a.effect as KeyframeEffect).pseudoElement ?? '');
          if (m) groups.set(m[2], (groups.get(m[2]) ?? new Set()).add(m[1]));
        }
        const target = document.getElementById('p-' + document.documentElement.dataset.vt);
        (window as any).__vt = {
          pairs: [...groups].filter(([, k]) => k.has('old') && k.has('new')).map(([n]) => n),
          targetOpacity: target && getComputedStyle(target).opacity,
        };
      }, (err) => ((window as any).__vt = { skipped: String(err) }));
    });
  });
});

const names = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('*')].map((el) => getComputedStyle(el).viewTransitionName).filter((n) => n !== 'none'),
  );
// A navigation started before the old page painted gets no transition.
const painted = (page: Page) => page.evaluate(() => document.fonts.ready.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))));
const ran = (page: Page) => page.waitForFunction(() => (window as any).__vt, undefined, { timeout: 5000 }).then((h) => h.jsonValue() as Promise<{ pairs: string[]; targetOpacity: string }>);

async function openFirstProject(page: Page) {
  await page.goto('/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const card = page.locator('#projects .card').first();
  const slug = (await card.getAttribute('href'))!.split('/').filter(Boolean).pop()!;
  await painted(page);
  await card.click();
  await expect(page).toHaveURL(new RegExp(`/projects/${slug}/$`));
  return slug;
}

test('card and detail window share three names, unique on every page', async ({ page }) => {
  const slug = await openFirstProject(page);
  const vt = await ran(page);
  for (const n of ['card', 'title', 'shot']) expect(vt.pairs).toContain(`${n}-${slug}`);
  expect(vt).not.toHaveProperty("skipped");
  expect(vt.targetOpacity).toBe('1');
  for (const path of ['/', `/projects/${slug}/`]) {
    await page.goto(path);
    const list = await names(page);
    expect(new Set(list).size, path).toBe(list.length);
  }
  expect((await names(page)).filter((n) => n.endsWith(slug))).toHaveLength(3);
});

test('"< back" morphs the window into its card', async ({ page }) => {
  const slug = await openFirstProject(page);
  await page.evaluate(() => delete (window as any).__vt);
  await painted(page);
  await page.locator('a.back').click();
  await expect(page).toHaveURL(new RegExp(`/#p-${slug}$`));
  const vt = await ran(page);
  for (const n of ['card', 'title', 'shot']) expect(vt.pairs).toContain(`${n}-${slug}`);
  expect(vt).not.toHaveProperty("skipped");
  expect(vt.targetOpacity).toBe('1');
  const li = page.locator(`#p-${slug}`);
  await expect(li).toBeVisible();
  await expect(li).toHaveCSS('opacity', '1');
  await expect(li).toBeInViewport();
  // names cleared once finished: home never keeps six (or any) names on cards
  await expect.poll(() => names(page).then((n) => n.filter((x) => x.endsWith(slug)).length)).toBe(0);
});

test('browser Back morphs into the card', async ({ page }) => {
  const slug = await openFirstProject(page);
  await page.evaluate(() => delete (window as any).__vt);
  await painted(page);
  await page.goBack();
  await expect(page).toHaveURL('/');
  const vt = await ran(page);
  for (const n of ['card', 'title', 'shot']) expect(vt.pairs).toContain(`${n}-${slug}`);
  expect(vt).not.toHaveProperty("skipped");
  expect(vt.targetOpacity).toBe('1');
  await expect(page.locator(`#p-${slug}`)).toHaveCSS('opacity', '1');
});

test('language switch crossfades without breaking', async ({ page }) => {
  await page.goto('/');
  await painted(page);
  await page.locator('.lang a[hreflang="es"]').click();
  await expect(page).toHaveURL(/\/es\/$/);
  const vt = await ran(page);
  expect(vt.pairs).toContain('site-header');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('navigates without a view transition', async ({ page }) => {
    await openFirstProject(page);
    expect(await page.evaluate(() => (window as any).__vt)).toBeUndefined();
    await expect(page.locator('.window')).toBeVisible();
  });
});
