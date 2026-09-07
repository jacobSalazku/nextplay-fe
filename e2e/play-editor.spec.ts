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
    const token = () => page.getByRole('button', { name: 'Move player 1' });
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
    const tools = page.getByRole('toolbar', { name: 'Drawing tools' });

    // Act — Pass tool, drag from player 1 to player 2, then back to Select
    await tools.getByRole('button', { name: 'Pass' }).click();
    await drag(
      page,
      page.getByRole('button', { name: 'Draw from player 1' }),
      await centre(page.getByRole('button', { name: 'Draw from player 2' })),
    );
    await tools.getByRole('button', { name: 'Select' }).click();

    // Assert — one route on the canvas; select it
    await expect(overlayPaths).toHaveCount(1);
    await overlayPaths.first().click({ force: true });

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

    // Act — select and delete it from the on-canvas control
    await overlayPaths.first().click({ force: true });
    await page.getByRole('button', { name: 'Delete' }).click();

    // Assert — gone, and the delete persists
    await expect(overlayPaths).toHaveCount(0);
    await page.getByRole('button', { name: /save/i }).click();
    await page.reload();
    await expect(overlayPaths).toHaveCount(0);
  });

  test('breakdown: set a category and a phase note, and they persist', async ({
    page,
  }) => {
    // Arrange
    await newPlay(page);
    await page.getByRole('tab', { name: 'Breakdown' }).click();

    // Act — pick a category and write a note
    await page.getByRole('button', { name: 'Defense' }).click();
    await page.getByLabel('Phase 1 note').fill('Punch it inside to the 5.');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();

    // Assert — both survive a reload
    await page.reload();
    await page.getByRole('tab', { name: 'Breakdown' }).click();
    await expect(page.getByRole('button', { name: 'Defense' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByLabel('Phase 1 note')).toHaveValue(
      'Punch it inside to the 5.',
    );
  });

  test('match man-to-man, give the ball, bench a player, and undo', async ({
    page,
  }) => {
    // Arrange
    await newPlay(page);
    const tokens = page.locator('[role="application"] circle[role="button"]');
    const roster = page.getByRole('complementary', { name: 'Roster' });

    // Act — add five defenders
    const before = await tokens.count();
    await roster.getByRole('button', { name: /match man-to-man/i }).click();

    // Assert — five defender grab targets appeared
    await expect
      .poll(async () => (await tokens.count()) - before)
      .toBeGreaterThanOrEqual(5);

    // Act — give player 1 the ball from its roster chip, then save
    await roster.getByRole('button', { name: 'Give the ball to 1' }).click();
    await page.getByRole('button', { name: /save/i }).click();
    await page.reload();

    // Assert — possession persisted
    await expect(
      roster.getByRole('button', { name: 'Take the ball from 1' }),
    ).toBeVisible();

    // Act — bench player 3, then undo
    await roster.getByRole('button', { name: 'Player 3, on court' }).click();
    await expect(
      roster.getByRole('button', { name: 'Player 3, benched' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Undo' }).click();

    // Assert — player 3 is back on the court
    await expect(
      roster.getByRole('button', { name: 'Player 3, on court' }),
    ).toBeVisible();
  });

  test('add a phase, move a player in it, and both phases persist', async ({
    page,
  }) => {
    // Arrange
    await newPlay(page);
    const strip = page.getByRole('tablist', { name: 'Phases' });
    const token = () => page.getByRole('button', { name: 'Move player 1' });
    const p1Pos = await pos(token());

    // Act — add a second phase and move player 1 in it
    await page.getByRole('button', { name: 'Add phase' }).click();
    await expect(strip.getByRole('tab')).toHaveCount(2);
    await drag(page, token(), { x: 500, y: 250 });
    const p2Pos = await pos(token());
    expect(p2Pos).not.toEqual(p1Pos);

    // Assert — phase 1 still has the player where it started
    await strip.getByRole('tab', { name: 'Phase 1' }).click();
    expect(await pos(token())).toEqual(p1Pos);

    // Act — save and reload
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();
    await page.reload();

    // Assert — two phases, each with its own position
    await expect(strip.getByRole('tab')).toHaveCount(2);
    expect(await pos(token())).toEqual(p1Pos);
    await strip.getByRole('tab', { name: 'Phase 2' }).click();
    expect(await pos(token())).toEqual(p2Pos);
  });

  test('warns before leaving with unsaved changes', async ({ page }) => {
    // Arrange — a fresh play with one dragged (unsaved) player
    await newPlay(page);
    await drag(page, page.getByRole('button', { name: 'Move player 1' }), {
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
