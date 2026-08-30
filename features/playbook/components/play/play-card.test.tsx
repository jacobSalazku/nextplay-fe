import { makePlay } from '../../../../test/factories';
import { api, gqlData, gqlError } from '../../../../test/msw/handlers';
import { server } from '../../../../test/msw/server';
import { renderWithClient } from '../../../../test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlayCard } from './play-card';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh, push: vi.fn() }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/context/team-context', () => ({
  useTeam: () => ({ routeKey: 'team-1' }),
}));

describe('PlayCard', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows the play name and summary', () => {
    renderWithClient(
      <PlayCard
        play={makePlay({
          name: 'Horns Flare',
          description: '<p>Elbow entry</p>',
        })}
        role="COACH"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Horns Flare' })).toBeVisible();
    expect(screen.getByText('Elbow entry')).toBeVisible();
  });

  it('only offers delete to a COACH', () => {
    const { rerender } = renderWithClient(
      <PlayCard play={makePlay()} role="PLAYER" />,
    );
    expect(
      screen.queryByRole('button', { name: /delete play/i }),
    ).not.toBeInTheDocument();

    rerender(<PlayCard play={makePlay()} role="COACH" />);
    expect(screen.getByRole('button', { name: /delete play/i })).toBeVisible();
  });

  it('deletes, refreshes and toasts on success', async () => {
    const seen = vi.fn();
    server.use(
      api.mutation('DeletePlay', ({ variables }) => {
        seen(variables);
        return gqlData({ deletePlay: { id: 'p1' } });
      }),
    );
    const play = makePlay({ id: 'p1' });

    renderWithClient(<PlayCard play={play} role="COACH" />);
    await userEvent.click(screen.getByRole('button', { name: /delete play/i }));

    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(seen).toHaveBeenCalledWith({
      input: { routeKey: 'team-1', id: 'p1' },
    });
    expect(toast.success).toHaveBeenCalledWith(
      'Play deleted',
      expect.objectContaining({ position: 'top-right' }),
    );
  });

  it('does not refresh when the delete fails', async () => {
    server.use(api.mutation('DeletePlay', () => gqlError('Not a coach')));

    renderWithClient(<PlayCard play={makePlay()} role="COACH" />);
    await userEvent.click(screen.getByRole('button', { name: /delete play/i }));

    await waitFor(() => expect(toast.error).not.toHaveBeenCalled()); // handled globally, not here
    expect(refresh).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
