import { existsSync } from 'node:fs';
import { expect, test, type Locator, type Page } from '@playwright/test';
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

// Creates a 5-Out play and lands in the editor.
async function newPlay(page: Page) {
  await page.goto(`/team/${TEAM}/playbook/play/new`);
  await page.getByRole('button', { name: 'Offense' }).click();
  await page.getByRole('button', { name: /5-Out/ }).click();
  await page.getByRole('button', { name: 'Create play' }).click();
  await page.waitForURL(/\/playbook\/play\/[^/]+\/edit/);
}

async function centre(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = (await locator.boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function drag(page: Page, from: Locator, to: { x: number; y: number }) {
  const start = await centre(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
}

const pos = (token: Locator) =>
  token.evaluate((el) => ({
    x: el.getAttribute('cx'),
    y: el.getAttribute('cy'),
  }));

test.describe('play editor flow', () => {
  // global-setup writes this only when the backend is reachable; CI runs
  // Playwright without a backend, so the flow skips there.
  test.skip(() => !existsSync(AUTH_FILE), 'needs a seeded backend');
  test.use({ storageState: AUTH_FILE, viewport: { width: 1280, height: 920 } });

  test('create a play, drag a player, save, and the move persists', async ({
    page,
  }) => {
    // Arrange
    await newPlay(page);
    const token = () => page.getByRole('button', { name: 'Move 1' });
    const before = await pos(token());

    // Act — drag the player, then save
    await drag(page, token(), { x: 400, y: 300 });
    expect(await pos(token())).not.toEqual(before);

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();

    // Assert — the move survived the reload (not reset to the formation)
    await page.reload();
    expect(await pos(token())).not.toEqual(before);
  });

  test('draw a route, bend it, save, then delete it', async ({ page }) => {
    // Arrange
    await newPlay(page);
    const overlayPaths = page.locator('[role="application"] > path');
    const panel = page.getByRole('complementary', { name: 'Selection' });

    const tools = page.getByRole('toolbar', { name: 'Drawing tools' });

    // Act — Pass tool, drag from player 1 to player 2, then back to Select
    await tools.getByRole('button', { name: 'Pass' }).click();
    await drag(
      page,
      page.getByRole('button', { name: 'Draw from 1' }),
      await centre(page.getByRole('button', { name: 'Draw from 2' })),
    );
    await tools.getByRole('button', { name: 'Select' }).click();

    // Assert — one route on the canvas; select it
    await expect(overlayPaths).toHaveCount(1);
    await overlayPaths.first().click({ force: true });
    await expect(panel.getByText('Pass')).toBeVisible();

    // Act — bend it, then save
    const bend = page.getByRole('button', { name: 'Bend route' });
    await expect(bend).toBeVisible();
    const bendAt = await centre(bend);
    await drag(page, bend, { x: bendAt.x + 60, y: bendAt.y + 60 });

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();

    // Assert — the route survives a reload
    await page.reload();
    await expect(overlayPaths).toHaveCount(1);

    // Act — select and delete it
    await overlayPaths.first().click({ force: true });
    await panel.getByRole('button', { name: /delete route/i }).click();

    // Assert — gone, and the delete persists
    await expect(overlayPaths).toHaveCount(0);
    await page.getByRole('button', { name: /save/i }).click();
    await page.reload();
    await expect(overlayPaths).toHaveCount(0);
  });

  test('warns before leaving with unsaved changes', async ({ page }) => {
    // Arrange — a fresh play with one dragged (unsaved) player
    await newPlay(page);
    await drag(page, page.getByRole('button', { name: 'Move 1' }), {
      x: 300,
      y: 250,
    });

    // Act — the editor's own back button
    await page.getByRole('button', { name: /back to playbook/i }).click();

    // Assert — confirm dialog, cancel keeps us in the editor
    const dialog = page.getByRole('alertdialog', {
      name: /leave without saving/i,
    });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /cancel/i }).click();
    await expect(page).toHaveURL(/\/edit/);

    // Act — the browser Back button
    await page.goBack();

    // Assert — same guard
    await expect(dialog).toBeVisible();
  });
});
