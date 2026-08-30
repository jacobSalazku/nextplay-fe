import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Browser-level tests for things Vitest can't reach — async Server Components,
 * routing, hydration. Specs live in `e2e/`. Vitest ignores that folder.
 *
 * The dev server here talks to a real backend at NEXT_PUBLIC_GRAPHQL_ENDPOINT;
 * specs that need data should stub it with `page.route(...)`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: 'http://localhost:3001/graphql',
      NEXT_PUBLIC_DEV_AUTH_ENABLED: 'true',
      AUTH_SECRET: 'playwright-only',
      NEXTAUTH_SECRET: 'playwright-only',
    },
  },
});
