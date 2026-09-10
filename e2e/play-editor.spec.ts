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

// A screen point at fraction (fx, fy) of the editor canvas — layout-independent
// so panel widths don't shift where a drag lands.
async function courtPoint(page: Page, fx: number, fy: number) {
  const box = (await page.locator('[role="application"]').boundingBox())!;
  return { x: box.x + box.width * fx, y: box.y + box.height * fy };
}

// the rendered cx/cy are full-precision floats (the y axis is scaled into the
// viewBox), so round before comparing — a save/reload round-trip can wobble the
// last decimal without the player having actually moved
const pos = (token: Locator) =>
  token.evaluate((el) => ({
    x: Number(el.getAttribute('cx')).toFixed(2),
    y: Number(el.getAttribute('cy')).toFixed(2),
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
    await drag(page, token(), await courtPoint(page, 0.3, 0.25));
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

    // Act — pick a category, write a note, make part of it bold
    await page.getByRole('button', { name: 'Defense' }).click();
    const note = page.locator('.ProseMirror');
    await note.click();
    await note.pressSequentially('Punch it inside to the 5.');
    await note.press('ControlOrMeta+a');
    await page.getByRole('button', { name: 'Bold' }).click();

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();

    // Assert — both survive a reload, formatting included
    await page.reload();
    await page.getByRole('tab', { name: 'Breakdown' }).click();
    await expect(page.getByRole('button', { name: 'Defense' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('.ProseMirror')).toContainText(
      'Punch it inside to the 5.',
    );
    await expect(page.locator('.ProseMirror strong')).toBeVisible();
  });

  test('put opponents on court, give the ball, bench a player, and undo', async ({
    page,
  }) => {
    // Arrange
    await newPlay(page);
    const tokens = page.locator('[role="application"] circle[role="button"]');
    const roster = page.getByRole('complementary', { name: 'Roster' });

    // Act — put five opponents on the court from their roster chips
    const before = await tokens.count();
    for (let n = 1; n <= 5; n++) {
      await roster.getByRole('button', { name: `Opponent ${n}, benched` }).click();
    }

    // Assert — five defender grab targets appeared
    await expect
      .poll(async () => (await tokens.count()) - before)
      .toBeGreaterThanOrEqual(5);

    // Act — give player 1 the ball from its roster chip, then save
    await roster.getByRole('button', { name: 'Give the ball to 1' }).click();
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();
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

    // Act — add a second phase (Add phase ▸ Empty court) and move player 1 in it
    await page.getByRole('button', { name: 'Add phase' }).click();
    await page.getByRole('button', { name: 'Empty court' }).click();
    await expect(strip.getByRole('tab')).toHaveCount(2);
    await drag(page, token(), await courtPoint(page, 0.72, 0.3));
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

  test('animate: playing moves a token, scrubbing is deterministic', async ({
    page,
  }) => {
    // Arrange — two phases with player 1 in a different spot in each
    await newPlay(page);
    const token = () => page.getByRole('button', { name: 'Move player 1' });
    await page.getByRole('button', { name: 'Add phase' }).click();
    await page.getByRole('button', { name: 'Empty court' }).click();
    await drag(page, token(), await courtPoint(page, 0.75, 0.32));

    await page.getByRole('tab', { name: 'Animate' }).click();
    // the moving token layer, order-stable, so we can compare whole frames
    const layout = () =>
      page
        .locator('svg[aria-label^="Play animation"] [data-object-id]')
        .evaluateAll((els) =>
          els.map((el) => el.getAttribute('transform')).join('|'),
        );
    await expect(
      page.locator('svg[aria-label^="Play animation"]'),
    ).toBeVisible();
    const at0 = await layout();
    const slider = page.getByRole('slider', { name: 'Timeline' });
    // native setter + input event, so React's onChange fires like a real drag
    const scrub = (value: number) =>
      slider.evaluate((el, v) => {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )!.set!;
        setter.call(el, String(v));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, value);

    // Act — play
    await page.getByRole('button', { name: 'Play', exact: true }).click();

    // Assert — the frame changes and the timeline advances
    await expect.poll(layout).not.toBe(at0);
    await expect
      .poll(async () => Number(await slider.inputValue()))
      .toBeGreaterThan(0);

    // Act — stop, then scrub to the end and back to the start
    const pause = page.getByRole('button', { name: 'Pause', exact: true });
    if (await pause.count()) await pause.click();

    await scrub(1);
    await expect.poll(layout).not.toBe(at0);

    await scrub(0);
    await expect.poll(layout).toBe(at0);
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

  test('exports the phases as a PNG', async ({ page }) => {
    // Arrange
    await newPlay(page);

    // Act — Export ▸ All phases
    await page.getByRole('button', { name: 'Export' }).click();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /All phases/ }).click();

    // Assert — a .png actually came down
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/\.png$/);
  });
});
