import { expect, test } from '@playwright/test';

test('an unknown route renders the branded not-found page', async ({
  page,
}) => {
  const res = await page.goto('/this-route-does-not-exist');

  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: /page not found/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /go to dashboard/i }),
  ).toHaveAttribute('href', '/club');
});
