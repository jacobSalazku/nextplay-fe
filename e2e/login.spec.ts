import { expect, test } from '@playwright/test';

test.describe('login page', () => {
  test('server-renders the login options and hydrates the dev form', async ({
    page,
  }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: /log in bij nextplay/i }),
    ).toBeVisible();

    // dev-login form is present (NEXT_PUBLIC_DEV_AUTH_ENABLED=true)
    await expect(page.getByLabel(/dev login email/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /sign in with dev email/i }),
    ).toBeEnabled();
  });

  test('a protected route redirects an unauthenticated visitor to login', async ({
    page,
  }) => {
    await page.goto('/team/whatever/schedule');
    await expect(page).toHaveURL(/\/login/);
  });
});
