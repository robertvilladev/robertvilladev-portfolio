// GitHub data (009). Private repos are checked on any build; the fallback checks need a
// `GITHUB_DATA=off` build (CI sets it for the whole job).
import { readdirSync, readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { ui } from '../src/i18n/ui';
import { projects } from './projects';

const built = readdirSync('dist', { recursive: true, encoding: 'utf8' }).filter((f) => /\.(html|json)$/.test(f));

for (const p of projects.filter((p) => p.private)) {
  test(`${p.slug}: private repo is never linked and shows the private tag`, async ({ page }) => {
    for (const f of built) expect(readFileSync(`dist/${f}`, 'utf8'), f).not.toContain(p.repo);
    await page.goto(`/projects/${p.slug}/`);
    await expect(page.locator('.links').getByText(ui.en['projects.private'])).toBeVisible();
    await expect(page.getByRole('link', { name: ui.en['project.source'] })).toHaveCount(0);
    await page.goto('/');
    await expect(page.locator('.card', { hasText: p.slug }).getByText(ui.en['projects.private'])).toHaveCount(1);
  });
}

test('terminal: git log completes its subcommand and project slugs', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Slash');
  const input = page.getByRole('dialog').getByRole('textbox');
  await input.pressSequentially('git l');
  await input.press('Tab');
  await expect(input).toHaveValue('git log ');
  await input.pressSequentially('gotd');
  await input.press('Tab');
  await expect(input).toHaveValue('git log gotdle ');
});

test.describe('without GitHub data', () => {
  test.skip(process.env.GITHUB_DATA !== 'off', 'needs a GITHUB_DATA=off build');

  test('cards show running and the hero has no git log line', async ({ page }) => {
    await page.goto('/');
    const runs = page.locator('.card__bar');
    await expect(runs).toHaveCount(projects.length);
    for (const run of await runs.all()) await expect(run).toContainText(ui.en['projects.running']);
    await expect(page.getByText('git log -1')).toHaveCount(0);
    await expect(page.locator('.card time')).toHaveCount(0);
  });

  test('terminal: git log has no history to show', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Slash');
    const input = page.getByRole('dialog').getByRole('textbox');
    await input.fill('git log');
    await input.press('Enter');
    await expect(page.getByRole('log')).toContainText(ui.en['term.git.none']);
  });

  for (const p of projects)
    test(`/projects/${p.slug}/ renders without the language bar or log`, async ({ page }) => {
      await page.goto(`/projects/${p.slug}/`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText(ui.en['project.languages'])).toHaveCount(0);
      await expect(page.getByText('git log')).toHaveCount(0);
    });
});
