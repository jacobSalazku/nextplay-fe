import PlayerDetailPanel from '@/features/team/components/player-detail-panel';
import { GetUserProfileQuery, Role, Status } from '@/graphql/graphql';
import { api, gqlData, gqlError } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithClient } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/context/team-context', () => ({
  useTeam: () => ({ routeKey: 'team-1' }),
}));

const makeMember = (
  overrides: Partial<NonNullable<GetUserProfileQuery['getUserProfile']>> = {},
): NonNullable<GetUserProfileQuery['getUserProfile']> => ({
  __typename: 'MemberWithAttendances',
  id: 'm1',
  userId: 'u1',
  teamId: 't1',
  role: Role.Player,
  status: Status.Active,
  number: '23',
  position: 'PG',
  name: 'Jordan Bell',
  user: {
    __typename: 'UserDetail',
    id: 'u1',
    name: 'Jordan Bell',
    email: 'jordan@example.com',
    image: null,
    dateOfBirth: null,
    phone: null,
    height: null,
    weight: null,
    dominantHand: null,
    hasOnBoarded: true,
  },
  attendances: [],
  ...overrides,
});

describe('PlayerDetailPanel', () => {
  afterEach(() => vi.clearAllMocks());

  it('only offers removal to a COACH', () => {
    const { rerender } = renderWithClient(
      <PlayerDetailPanel userProfile={makeMember({ role: Role.Player })} />,
    );
    expect(
      screen.queryByRole('button', { name: /remove from team/i }),
    ).not.toBeInTheDocument();

    rerender(
      <PlayerDetailPanel userProfile={makeMember({ role: Role.Coach })} />,
    );
    expect(
      screen.getByRole('button', { name: /remove from team/i }),
    ).toBeVisible();
  });

  it('removes the member, redirects to the roster and toasts on success', async () => {
    const seen = vi.fn();
    server.use(
      api.mutation('DeleteMember', ({ variables }) => {
        seen(variables);
        return gqlData({ deleteMember: true });
      }),
    );

    renderWithClient(
      <PlayerDetailPanel
        userProfile={makeMember({ id: 'm1', role: Role.Coach })}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /remove from team/i }),
    );

    await waitFor(() => expect(push).toHaveBeenCalledOnce());
    expect(push).toHaveBeenCalledWith('/team/team-1/players');
    expect(seen).toHaveBeenCalledWith({
      input: { id: 'm1', routeKey: 'team-1' },
    });
    expect(toast.success).toHaveBeenCalledWith(
      'Player removed from team',
      expect.objectContaining({ position: 'top-center' }),
    );
  });

  it('does not redirect when the removal fails', async () => {
    server.use(api.mutation('DeleteMember', () => gqlError('Not a coach')));

    renderWithClient(
      <PlayerDetailPanel userProfile={makeMember({ role: Role.Coach })} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /remove from team/i }),
    );

    await waitFor(() => expect(toast.error).not.toHaveBeenCalled()); // handled globally, not here
    expect(push).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
