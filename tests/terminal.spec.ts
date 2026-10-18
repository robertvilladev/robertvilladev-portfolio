import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ui, langs, defaultLang, type Lang, type UiKey } from '../src/i18n/ui';
import { career } from '../src/data/career';
import { site } from '../src/config';

const home = (l: Lang) => (l === defaultLang ? '/' : `/${l}/`);
const dialog = (page: Page) => page.getByRole('dialog');
const input = (page: Page) => dialog(page).getByRole('textbox');
const log = (page: Page) => dialog(page).getByRole('log');

async function open(page: Page, path = '/') {
  await page.goto(path);
  await page.keyboard.press('Slash');
  await expect(input(page)).toBeFocused();
}

async function run(page: Page, cmd: string) {
  await input(page).fill(cmd);
  await input(page).press('Enter');
}

test.describe('open and close', () => {
  test('/ opens, Escape closes', async ({ page }) => {
    await open(page);
    await expect(dialog(page)).toHaveAccessibleName(ui.en['term.title']);
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeHidden();
  });

  test('backtick opens, exit closes', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Backquote');
    await expect(input(page)).toBeFocused();
    await run(page, 'exit');
    await expect(dialog(page)).toBeHidden();
  });

  test('the >_ button opens, the close button closes and focus returns to the opener', async ({ page }) => {
    await page.goto('/');
    const opener = page.getByRole('button', { name: ui.en['term.open'] });
    await opener.click();
    await expect(input(page)).toBeFocused();
    await dialog(page).getByRole('button', { name: ui.en['term.close'] }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('/ typed in a text field does not open it', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.body.append(Object.assign(document.createElement('input'), { id: 'probe' })));
    await page.locator('#probe').press('Slash');
    await expect(page.locator('#probe')).toHaveValue('/');
    await expect(page.locator('dialog')).toHaveCount(0);
  });

  test('works on the 404 page, in its locale', async ({ page }) => {
    await open(page, '/es/nope/');
    await expect(log(page)).toContainText(ui.es['term.welcome']);
    await run(page, 'whoami');
    await expect(log(page)).toContainText(ui.es['hero.role']);
  });
});

for (const lang of langs) {
  test(`${lang}: every command prints localized output`, async ({ page }) => {
    const t = (k: UiKey) => ui[lang][k];
    await page.goto(home(lang));
    await expect(page.locator('.hero')).toContainText(t('hero.hint'));
    await open(page, home(lang));
    await expect(log(page)).toContainText(t('term.welcome'));

    const cases: [string, ...string[]][] = [
      ['help', t('term.man.ls').split(' — ')[1], t('term.man.open').split(' — ')[1]],
      ['man cd', t('term.manSynopsis'), 'cd [dir]'],
      ['man nope', t('term.noMan')],
      ['whoami', site.name, t('hero.role')],
      ['ls', 'about.md', 'career.log', 'contact', 'projects/'],
      ['cat about.md', t('about.body')],
      ['cat career.log', career[0].role[lang], career[0].note[lang]],
      ['contact', site.email!, site.github],
      ['cat nope', t('term.noSuch')],
      ['cat projects', t('term.isDir')],
      ['cat', t('term.usage')],
      ['cd about.md', t('term.notDir')],
      ['tree', '└── projects/', '│   └── README.md'],
      ['cd projects', ''],
      ['ls', 'gotdle/'],
      ['cat gotdle/README.md', '# Gotdle', 'https://github.com/robertvilladev/gotdle-vue3'],
      ['cd ..', ''],
      ['cat projects/mancos-gg/README.md', `repo: ${t('projects.private')}`],
      ['neofetch', 'robert@villa', t('term.nf.langs'), 'en · es · ca', t('lang.egg')],
      ['theme', `${t('theme.name')}: `],
      ['theme nope', t('term.usage')],
      ['open', t('term.usage')],
      ['open nope', t('term.noSuch')],
      ['open gotdle --demo', t('term.noDemo')],
      ['open mancos-gg --repo', t('term.noRepo')],
      ['git', t('term.usage')],
      ['git log nope', t('term.noSuch')],
      ['git log mancos-gg', t('term.git.none')],
      ['man git', 'git log ['],
      ['lang xx', t('term.usage')],
      ['history', 'neofetch', 'open gotdle --demo'],
      ['hepl', `zsh: ${t('404.msg')}: hepl`, `${t('404.hint')} help?`],
      ['sudo make-me-a-sandwich', t('term.sudo.no')],
      ['rm notes.txt', t('term.rm.denied')],
      ['rm -rf /', t('term.rm.removing'), t('term.rm.kidding')],
    ];
    for (const [cmd, ...expected] of cases) {
      await run(page, 'clear');
      await run(page, cmd);
      for (const text of expected) await expect(log(page), cmd).toContainText(text);
    }

    await run(page, 'theme light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('[data-theme-toggle] [data-theme-name]')).toHaveText('light');
    await run(page, 'theme dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await run(page, 'email');
    await expect(log(page)).toContainText(`${t('term.opening')} ${site.email}`);
    await expect(log(page).getByRole('link', { name: site.email! })).toHaveAttribute('href', `mailto:${site.email}`);
  });
}

test('open, lang and history survive navigation', async ({ page }) => {
  await open(page);
  await run(page, 'cd projects');
  await run(page, 'open gotdle');
  await page.waitForURL('**/projects/gotdle/');
  await expect(input(page)).toBeFocused();
  await expect(dialog(page)).toContainText('~/projects $');

  await run(page, 'lang ca');
  await page.waitForURL('**/ca/projects/gotdle/');
  await expect(log(page)).toContainText(ui.ca['term.welcome']);
  await input(page).press('ArrowUp');
  await expect(input(page)).toHaveValue('lang ca');
  await input(page).press('ArrowUp');
  await expect(input(page)).toHaveValue('open gotdle');

  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('dialog')).toHaveCount(0);
});

test('open --repo opens the repo in a new tab', async ({ page, context }) => {
  const { projects } = await (await page.request.get('/terminal/en.json')).json();
  await context.route('https://github.com/**', (r) => r.fulfill({ body: 'repo' }));
  await open(page);
  const [popup] = await Promise.all([context.waitForEvent('page'), run(page, 'open gotdle --repo')]);
  await popup.waitForLoadState();
  expect(popup.url()).toBe(projects.gotdle.repo);
  await expect(page).toHaveURL('/');
});

test('sudo hire-me closes and lands on #contact', async ({ page }) => {
  await open(page, '/projects/gotdle/');
  await run(page, 'sudo hire-me');
  await expect(log(page)).toContainText(ui.en['term.sudo.hire'].split('\n')[0]);
  await page.waitForURL('**/#contact');
  await expect(page.locator('dialog')).toHaveCount(0);
});

test('keyboard only: completion, history, leaving', async ({ page }) => {
  await open(page);
  await input(page).pressSequentially('c');
  await input(page).press('Tab');
  await expect(log(page)).toContainText('cat  cd  clear  contact');
  await input(page).pressSequentially('d pro');
  await input(page).press('Tab');
  await expect(input(page)).toHaveValue('cd projects/');
  await input(page).press('Enter');
  await input(page).pressSequentially('cat go');
  await input(page).press('Tab');
  await expect(input(page)).toHaveValue('cat gotdle/');
  await input(page).pressSequentially('R');
  await input(page).press('Tab');
  await expect(input(page)).toHaveValue('cat gotdle/README.md ');
  await input(page).press('Enter');
  await expect(log(page)).toContainText('# Gotdle');
  await input(page).press('ArrowUp');
  await expect(input(page)).toHaveValue('cat gotdle/README.md');
  await input(page).press('ArrowUp');
  await expect(input(page)).toHaveValue('cd projects/');
  await input(page).press('ArrowDown');
  await input(page).press('ArrowDown');
  await expect(input(page)).toHaveValue('');
  await input(page).pressSequentially('clear');
  await input(page).press('Enter');
  // Tab on an empty line moves focus, so the close button stays reachable.
  await page.keyboard.press('Shift+Tab'); // the scrollable output
  await page.keyboard.press('Shift+Tab');
  await expect(dialog(page).getByRole('button', { name: ui.en['term.close'] })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toBeHidden();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the open terminal has no serious or critical axe violations', async ({ page }) => {
    await open(page);
    await run(page, 'help');
    await run(page, 'ls');
    const { violations } = await new AxeBuilder({ page }).analyze();
    const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });

  test('rm -rf / prints text only', async ({ page }) => {
    await open(page);
    await run(page, 'rm -rf /');
    await expect(log(page)).toContainText(ui.en['term.rm.kidding']);
    await expect(page.locator('html')).not.toHaveClass(/tx-melt/);
  });
});

test('usable at 375px with the >_ button', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: ui.en['term.open'] }).click();
  await run(page, 'neofetch');
  const box = (await input(page).boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(812 / 2 + 50);
  expect(box.width).toBeGreaterThan(150);
  expect(box.height).toBeGreaterThanOrEqual(44);
  const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(scroll).toBeLessThanOrEqual(width);
});
