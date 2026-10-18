import { test, expect, type Page } from '@playwright/test';
import { ui } from '../src/i18n/ui';

const html = (page: Page) => page.locator('html');
const konami = async (page: Page, b = 'b', a = 'a') => {
  for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', b, a])
    await page.keyboard.press(k);
};

test('the code sets data-glitch and it clears after about 5 s', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('ArrowUp'); // a false start still matches
  await konami(page);
  await expect(html(page)).toHaveAttribute('data-glitch');
  await expect(page.locator('.sparkle-layer span').first()).toBeAttached();
  await page.waitForTimeout(4000);
  await expect(html(page)).toHaveAttribute('data-glitch');
  await expect(html(page)).not.toHaveAttribute('data-glitch', { timeout: 2000 });
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

  test('the code shows the static message and no effect', async ({ page }) => {
    await page.goto('/es/');
    await konami(page);
    await expect(page.locator('[data-glitch-note]')).toHaveText(ui.es['term.glitch.reduced']);
    await expect(html(page)).not.toHaveAttribute('data-glitch');
    await expect(page.locator('.sparkle-layer span')).toHaveCount(0);
    await expect(page.locator('[data-glitch-note]')).toBeHidden({ timeout: 5000 });
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
