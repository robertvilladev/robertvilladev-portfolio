import { test, expect, type Page } from '@playwright/test';
import { ui } from '../src/i18n/ui';
import { ids } from '../src/lib/achievements';

// A returning visitor (booted) with no achievements; playwright.config.ts presets all of them for every other spec.
const origin = `http://localhost:${process.env.PORT ?? '4321'}`;
const state = (ach?: object) => ({
  cookies: [],
  origins: [{ origin, localStorage: [{ name: 'booted', value: '1' }, ...(ach ? [{ name: 'ach', value: JSON.stringify(ach) }] : [])] }],
});
test.use({ storageState: state() });

const en = ui.en;
const toast = (page: Page) => page.locator('.toast');
const input = (page: Page) => page.getByRole('dialog').getByRole('textbox');
const log = (page: Page) => page.getByRole('dialog').getByRole('log');
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('ach') ?? '{}'));

async function run(page: Page, cmd: string) {
  await input(page).fill(cmd);
  await input(page).press('Enter');
}

test('opening the terminal shows a toast with the count, above the terminal, without taking focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await expect(toast(page)).toHaveText(`${en['ach.title']} · ${en['ach.terminal']} · 1/12`);
  await expect(toast(page)).toHaveAttribute('aria-live', 'polite');
  await expect(toast(page).locator('.on')).toHaveCount(1);
  await expect(input(page)).toBeFocused();
  await expect(toast(page)).toBeEmpty({ timeout: 5000 });
});

test('toasts queue one after another with growing counts', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await run(page, 'rm -rf /');
  await expect(toast(page)).toContainText('1/12');
  await expect(toast(page)).toHaveText(`${en['ach.title']} · ${en['ach.root']} · 2/12`, { timeout: 5000 });
});

test('a toast cut off by a navigation shows on the next page', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await expect(toast(page)).toContainText(en['ach.terminal']);
  await page.goto('/projects/gotdle/');
  await expect(toast(page)).toContainText(en['ach.terminal']);
});

test('achievements lists progress, dates and hints, and survives a reload', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await page.keyboard.press('Escape');
  await page.reload();
  await page.keyboard.press('Slash');
  await run(page, 'achievements');
  await expect(log(page)).toContainText('[█░░░░░░░░░] 1/12');
  await expect(log(page)).toContainText(`✓ ${en['ach.terminal']} — ${new Date().toLocaleDateString('en')}`);
  await expect(log(page)).toContainText(`· ${en['ach.konami']} — ${en['ach.konami.hint']}`);
  await expect(log(page)).not.toContainText('___________');
  await run(page, 'help');
  await expect(log(page)).toContainText(en['term.man.achievements'].split(' — ')[1]);
});

test('reset asks for y; anything else cancels', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  await run(page, 'achievements reset');
  await expect(log(page)).toContainText(en['term.ach.confirm']);
  await run(page, 'whoami');
  await run(page, 'y');
  await expect(log(page)).toContainText(`zsh: ${en['404.msg']}: y`);
  expect(Object.keys((await stored(page)).unlocked)).toEqual(['terminal']);
  await run(page, 'achievements reset');
  await run(page, 'y');
  await expect(log(page)).toContainText(en['term.ach.wiped']);
  expect((await stored(page)).unlocked).toEqual({});
  await run(page, 'achievements');
  await expect(log(page)).toContainText('0/12');
});

test('the 404 page unlocks lost', async ({ page }) => {
  await page.goto('/nope/');
  await expect(toast(page)).toContainText(`${en['ach.lost']} · 1/12`);
  expect((await stored(page)).unlocked.lost).toBeGreaterThan(0);
});

test('commands, visits and clicks unlock the rest; completionist comes last with a trophy', async ({ page }) => {
  await page.goto('/es/');
  await page.goto('/ca/');
  await page.goto('/');
  for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) await page.keyboard.press(k);
  for (let i = 0; i < 100; i++) await page.mouse.click(5, 400);
  await page.keyboard.press('Slash');
  for (const cmd of ['theme matrix', 'theme amber', 'theme synthwave', 'theme night-city', 'theme dark', 'rm -rf /']) await run(page, cmd);
  await page.keyboard.press('Escape');
  // Chrome flushes localStorage a moment after a write; a navigation right after an unlock could read stale state.
  await page.waitForTimeout(300);
  for (const slug of await page.evaluate(() => document.documentElement.dataset.projects!.split(' '))) await page.goto(`/projects/${slug}/`);
  await page.goto('/nope/');
  const { unlocked } = await stored(page);
  expect(ids.filter((id) => !unlocked[id])).toEqual(['hire', 'reboot', 'completionist']);

  await page.goto('/');
  await page.keyboard.press('Slash');
  await run(page, 'reboot');
  await page.waitForTimeout(2000); // the boot replay ends
  await page.keyboard.press('Slash');
  await run(page, 'sudo hire-me');
  await page.waitForURL('**/#contact');
  expect(Object.keys((await stored(page)).unlocked).at(-1)).toBe('completionist');
  await page.keyboard.press('Slash');
  await run(page, 'achievements');
  await expect(log(page)).toContainText('[██████████] 12/12');
  await expect(log(page)).toContainText(en['term.ach.all']);
});

test.describe('boot panel', () => {
  test.use({ storageState: { cookies: [], origins: [{ origin, localStorage: [{ name: 'ach', value: JSON.stringify({ visited: { langs: ['es', 'ca'], projects: [] } }) }] }] } });

  test('a toast waits until the boot panel is gone', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.boot')).toBeVisible();
    await expect(toast(page)).not.toContainText(en['ach.polyglot']);
    await expect(page.locator('.boot')).toBeHidden({ timeout: 2500 });
    await expect(toast(page)).toContainText(`${en['ach.polyglot']} · 1/12`);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the toast shows without a slide', async ({ page }) => {
    await page.goto('/nope/');
    await expect(toast(page)).toContainText(en['ach.lost']);
    expect(await toast(page).locator('.toast__card').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  });
});
