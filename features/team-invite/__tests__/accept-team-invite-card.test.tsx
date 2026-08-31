import { AcceptTeamInviteCard } from '@/features/team-invite/components/accept-team-invite-card';
import { api, gqlData, gqlError } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithClient } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

describe('AcceptTeamInviteCard', () => {
  it('accepts the invite on mount and shows the success state', async () => {
    const seen = vi.fn();
    server.use(
      api.mutation('AcceptTeamInvite', ({ variables }) => {
        seen(variables);
        return gqlData({
          acceptTeamInvite: {
            status: 'SUCCESS',
            teamId: 't1',
            routeKey: 'team-1',
            memberId: 'm1',
          },
        });
      }),
    );

    renderWithClient(<AcceptTeamInviteCard token="tok-123" />);

    expect(await screen.findByText(/you joined the team/i)).toBeVisible();
    expect(seen).toHaveBeenCalledWith({ input: { token: 'tok-123' } });
    expect(screen.getByRole('button', { name: /open team/i })).toBeVisible();
  });

  it('renders its own error block on failure (no global toast)', async () => {
    server.use(
      api.mutation('AcceptTeamInvite', () => gqlError('Invite is revoked')),
    );

    renderWithClient(<AcceptTeamInviteCard token="tok-x" />);

    await waitFor(() =>
      expect(
        screen.getByText(/invite could not be checked/i),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText('Invite is revoked')).toBeVisible();
  });
});
