import { defineConfig, devices } from '@playwright/test';

const port = process.env.PORT ?? '4321';
const origin = `http://localhost:${port}`;

// Runs against the built site (`npm run build` first), never the dev server.
export default defineConfig({
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: origin,
    // Every test starts as a returning visitor, or the boot overlay (015) would block clicks. boot.spec.ts starts clean.
    storageState: { cookies: [], origins: [{ origin, localStorage: [{ name: 'booted', value: '1' }] }] },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx astro preview --port ${port}`,
    url: origin,
    reuseExistingServer: !process.env.CI,
  },
});
