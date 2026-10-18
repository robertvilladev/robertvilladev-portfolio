import { test, expect, type Page } from '@playwright/test';
import { ui } from '../src/i18n/ui';

const html = (page: Page) => page.locator('html');
const konami = async (page: Page, b = 'b', a = 'a') => {
  for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', b, a])
    await page.keyboard.press(k);
};

test('the code sets data-glitch and it clears after about 5 s', async ({ page }) => {
  await page.goto('/');
  // Times the effect in the page, so a slow test runner doesn't skew it.
  const duration = page.evaluate(
    () =>
      new Promise<number>((done) => {
        let start = 0;
        new MutationObserver(() => {
          const on = 'glitch' in document.documentElement.dataset;
          if (on && !start) start = performance.now();
          if (!on && start) done(performance.now() - start);
        }).observe(document.documentElement, { attributeFilter: ['data-glitch'] });
      }),
  );
  await page.keyboard.press('ArrowUp'); // a false start still matches
  await konami(page);
  await expect(html(page)).toHaveAttribute('data-glitch');
  await expect(page.locator('.sparkle-layer span').first()).toBeAttached();
  const ms = await duration;
  expect(ms).toBeGreaterThan(4900);
  expect(ms).toBeLessThan(5500);
});

test('B and A count in uppercase too', async ({ page }) => {
  await page.goto('/');
  await konami(page, 'B', 'A');
  await expect(html(page)).toHaveAttribute('data-glitch');
});

test('keys typed into a text field do not trigger it', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.body.append(Object.assign(document.createElement('textarea'), { id: 'probe' })));
  await page.locator('#probe').focus();
  await konami(page);
  await expect(page.locator('#probe')).toHaveValue('ba');
  await expect(html(page)).not.toHaveAttribute('data-glitch');
});

test('the glitch command closes the terminal and triggers it', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await page.getByRole('textbox').fill('glitch');
  await page.getByRole('textbox').press('Enter');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(html(page)).toHaveAttribute('data-glitch');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the code shows the message as a toast and no effect', async ({ page }) => {
    await page.goto('/es/');
    await konami(page);
    await expect(page.locator('.toast')).toHaveText(ui.es['term.glitch.reduced']);
    await expect(html(page)).not.toHaveAttribute('data-glitch');
    await expect(page.locator('.sparkle-layer span')).toHaveCount(0);
    await expect(page.locator('.toast')).toBeHidden({ timeout: 5000 });
  });

  test('the glitch command prints the message in the terminal', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Slash');
    await page.getByRole('textbox').fill('glitch');
    await page.getByRole('textbox').press('Enter');
    await expect(page.getByRole('log')).toContainText(ui.en['term.glitch.reduced']);
    await expect(html(page)).not.toHaveAttribute('data-glitch');
  });
});
