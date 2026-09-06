import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Browser-level tests for things Vitest can't reach — async Server Components,
 * routing, hydration. Specs live in `e2e/`. Vitest ignores that folder.
 *
 * Route/auth specs run anywhere. The `play editor flow` spec needs a real
 * backend: set `E2E_BACKEND_DIR` (+ `DATABASE_URL`) and it is booted below;
 * otherwise global-setup sees no backend and that spec skips itself.
 */
const backendServer = process.env.E2E_BACKEND_DIR
  ? [
      {
        command: 'sh e2e/start-backend.sh',
        url: 'http://localhost:3001/graphql',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
    ]
  : [];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    ...backendServer,
    {
      command: `pnpm build && pnpm start --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        BACKEND_GRAPHQL_URL: 'http://localhost:3001/graphql',
        NEXT_PUBLIC_DEV_AUTH_ENABLED: 'true',
        AUTH_SECRET: 'playwright-only',
        NEXTAUTH_SECRET: 'playwright-only',
        NEXTAUTH_URL: BASE_URL,
      },
    },
  ],
});
