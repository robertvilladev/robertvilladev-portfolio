import { test, expect, devices, type Page } from '@playwright/test';

const squares = (page: Page) => page.locator('.trail i');
const move = async (page: Page, x = 203, y = 117) => {
  await page.mouse.move(x - 50, y - 50);
  await page.mouse.move(x, y, { steps: 4 });
};

test('mouse move creates four squares and the head sits on the 8px grid', async ({ page }) => {
  await page.goto('/');
  await move(page);
  await expect(squares(page)).toHaveCount(4);
  await expect.poll(() => squares(page).first().evaluate((el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return [m.m41, m.m42];
  })).toEqual([200, 120]);
});

test('hovering a link grows the head', async ({ page }) => {
  await page.goto('/');
  const box = (await page.locator('header a:visible').first().boundingBox())!;
  await move(page, box.x + 4, box.y + 4);
  await expect(page.locator('.trail')).toHaveAttribute('data-grow', '');
  await move(page, 5, 5);
  await expect(page.locator('.trail')).not.toHaveAttribute('data-grow', '');
});

test('trail off hides it and survives a reload', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  const input = page.getByRole('dialog').getByRole('textbox');
  await input.fill('trail');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('trail: on');
  await input.fill('trail off');
  await input.press('Enter');
  await expect(page.locator('.trail')).toHaveCount(0);
  await page.reload();
  await move(page);
  await expect(page.locator('.trail')).toHaveCount(0);
  await page.evaluate(() => localStorage.removeItem('trail'));
});

test('hidden while over the open terminal', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.waitForTimeout(400); // opening animation
  const box = (await page.getByRole('dialog').boundingBox())!;
  await move(page, box.x + 40, box.y + 80);
  await expect(page.locator('.trail')).toHaveAttribute('data-hide', '');
});

test('reduced motion creates no trail', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await move(page);
  await expect(page.locator('.trail')).toHaveCount(0);
});

test('the rAF loop stops once the squares settle', async ({ page }) => {
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    (window as any).__raf = 0;
    // GSAP and Lenis keep their own ticker; count only the trail's callback.
    window.requestAnimationFrame = (cb) => { if (String(cb).includes('translate3d')) (window as any).__raf++; return raf(cb); };
  });
  await page.goto('/');
  await move(page);
  await expect(squares(page)).toHaveCount(4);
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => (window as any).__raf);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as any).__raf)).toBe(before);
});

test('coarse pointer creates no trail', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], baseURL: test.info().project.use.baseURL });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.mouse.move(100, 100);
  await page.mouse.move(150, 150);
  await expect(page.locator('.trail')).toHaveCount(0);
  await ctx.close();
});
