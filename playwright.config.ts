import { defineConfig, devices } from '@playwright/test';
import { ids } from './src/lib/achievements';

const port = process.env.PORT ?? '4321';
const origin = `http://localhost:${port}`;

// Runs against the built site (`npm run build` first), never the dev server.
export default defineConfig({
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: origin,
    // Every test starts as a returning visitor with every achievement (013), so neither the boot overlay (015) nor a
    // toast gets in the way. boot.spec.ts and achievements.spec.ts start clean.
    storageState: {
      cookies: [],
      origins: [{ origin, localStorage: [{ name: 'booted', value: '1' }, { name: 'ach', value: JSON.stringify({ unlocked: Object.fromEntries(ids.map((id) => [id, 1])) }) }] }],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx astro preview --port ${port}`,
    url: origin,
    reuseExistingServer: !process.env.CI,
  },
});
