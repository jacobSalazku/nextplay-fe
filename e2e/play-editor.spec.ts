import { expect, test } from '@playwright/test';

// The full new -> setup -> drag -> save -> reload flow needs a real backend
// (the setup and editor pages fetch server-side, and dev login calls the
// devLogin mutation). CI runs Playwright with no backend, so here we only
// assert the new routes inherit the team-layout auth guard. The drag/save
// behaviour is covered by the Vitest suite (EditorStage, PlayEditor).

test.describe('play editor routes', () => {
  test('the new-play setup route requires auth', async ({ page }) => {
    await page.goto('/team/acme~a1b2c3/playbook/play/new');
    await expect(page).toHaveURL(/\/login/);
  });

  test('the edit route requires auth', async ({ page }) => {
    await page.goto('/team/acme~a1b2c3/playbook/play/some-id/edit');
    await expect(page).toHaveURL(/\/login/);
  });
});
