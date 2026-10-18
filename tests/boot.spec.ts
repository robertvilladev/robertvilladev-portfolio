import { test, expect, type Page } from '@playwright/test';

// Unlike every other spec, these start as a first-time visitor (see playwright.config.ts).
test.use({ storageState: { cookies: [], origins: [] } });

const overlay = (page: Page) => page.locator('.boot');

test('first visit shows the overlay and it is gone within 2 s', async ({ page }) => {
  await page.goto('/');
  await expect(overlay(page)).toBeVisible();
  await expect(overlay(page)).toBeHidden({ timeout: 2000 });
  await expect(page.locator('html')).not.toHaveAttribute('data-boot');
});

test('a second visit shows nothing', async ({ page }) => {
  await page.goto('/');
  await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-boot');
  await expect(overlay(page)).toBeHidden();
});

test('a localized home also boots', async ({ page }) => {
  await page.goto('/es/');
  await expect(overlay(page)).toBeVisible();
});

test('a first visit straight to a project page shows nothing', async ({ page }) => {
  await page.goto('/projects/gotdle/');
  await expect(overlay(page)).toBeHidden();
});

test('a key skips instantly and "/" does not open the terminal', async ({ page }) => {
  await page.goto('/');
  await expect(overlay(page)).toBeVisible();
  await page.keyboard.press('Slash');
  await expect(overlay(page)).toBeHidden({ timeout: 300 });
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('a click skips and does not follow the link underneath', async ({ page }) => {
  await page.goto('/');
  await expect(overlay(page)).toBeVisible();
  await page.mouse.click(20, 30); // the header logo sits under this point, hidden by the overlay
  await expect(overlay(page)).toBeHidden({ timeout: 300 });
  await page.waitForTimeout(300);
  expect(new URL(page.url()).pathname).toBe('/');
});

test('reduced motion: no overlay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(overlay(page)).toBeHidden();
});

test('reboot replays it on any page', async ({ page }) => {
  await page.goto('/projects/gotdle/');
  await page.keyboard.press('Slash');
  await page.getByRole('textbox').fill('reboot');
  await page.getByRole('textbox').press('Enter');
  await expect(overlay(page)).toBeVisible();
  await expect(overlay(page)).toBeHidden({ timeout: 2500 });
});

test('reboot prints the lines in the terminal under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Slash');
  await page.getByRole('textbox').fill('reboot');
  await page.getByRole('textbox').press('Enter');
  await expect(page.getByRole('log')).toContainText('RV-BIOS');
  await expect(overlay(page)).toBeHidden();
});
