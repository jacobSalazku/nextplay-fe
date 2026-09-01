import { useLogout } from '@/features/auth/use-logout';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signOut } from 'next-auth/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfirmProvider } from '@/components/feedback/confirm-provider';

vi.mock('next-auth/react', () => ({ signOut: vi.fn() }));

function LogoutButton() {
  const logout = useLogout();
  return <button onClick={() => logout()}>Logout</button>;
}

const renderButton = () =>
  render(
    <ConfirmProvider>
      <LogoutButton />
    </ConfirmProvider>,
  );

describe('useLogout', () => {
  afterEach(() => vi.clearAllMocks());

  it('signs out only after the user confirms', async () => {
    renderButton();
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));

    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveTextContent('Log out?');
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Log out' }),
    );

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('does not sign out when cancelled', async () => {
    renderButton();
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
    await userEvent.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', {
        name: 'Cancel',
      }),
    );

    expect(signOut).not.toHaveBeenCalled();
  });
});
