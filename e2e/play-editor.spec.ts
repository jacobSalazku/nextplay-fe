import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { AUTH_FILE } from './global-setup';

const TEAM = 'cavs-173c3e20';

test.describe('play editor routes (unauthenticated)', () => {
  test('the new-play setup route requires auth', async ({ page }) => {
    await page.goto(`/team/${TEAM}/playbook/play/new`);
    await expect(page).toHaveURL(/\/login/);
  });

  test('the edit route requires auth', async ({ page }) => {
    await page.goto(`/team/${TEAM}/playbook/play/some-id/edit`);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('play editor flow', () => {
  // global-setup writes this only when the backend is reachable; CI runs
  // Playwright without a backend, so the flow skips there.
  test.skip(() => !existsSync(AUTH_FILE), 'needs a seeded backend');
  test.use({ storageState: AUTH_FILE });

  test('create a play, drag a player, save, and the move persists', async ({
    page,
  }) => {
    // Arrange — new-play setup
    await page.goto(`/team/${TEAM}/playbook/play/new`);
    await page.getByLabel('Name').fill('Playwright play');
    await page.getByRole('button', { name: 'Offense' }).click();
    await page.getByRole('button', { name: /5-Out/ }).click();

    // Act — create, land in the editor
    await page.getByRole('button', { name: 'Create play' }).click();
    await page.waitForURL(/\/playbook\/play\/[^/]+\/edit/);

    const handle = page.getByRole('button', { name: 'Move 1' });
    await expect(handle).toBeVisible();
    const before = await handle.evaluate(
      (el) => (el as HTMLElement).style.left,
    );

    // Act — drag the player right, then save
    const box = (await handle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, {
      steps: 8,
    });
    await page.mouse.up();

    const moved = await handle.evaluate((el) => (el as HTMLElement).style.left);
    expect(moved).not.toBe(before);

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();

    // Assert — the move survives a reload
    await page.reload();
    const afterReload = await page
      .getByRole('button', { name: 'Move 1' })
      .evaluate((el) => (el as HTMLElement).style.left);
    expect(afterReload).toBe(moved);
  });
});
