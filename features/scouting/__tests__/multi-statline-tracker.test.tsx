import { MultiStatlineTracker } from '@/features/scouting/components/multi-statline-tracker';
import { api, gqlData } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithClient } from '@/test/utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/context/team-context', () => ({
  useTeam: () => ({ routeKey: 'team-1' }),
}));

const players = [
  { id: 'm1', name: 'Jay Mason', number: '4', user: null, statlines: [] },
] as never;

const activity = {
  id: 'act-1',
  title: 'vs Hawks',
  game: { opponentStatline: null },
} as never;

describe('MultiStatlineTracker', () => {
  it('manual submit sends SubmitStatlines with the routeKey + players', async () => {
    const user = userEvent.setup();
    const seen = vi.fn();
    server.use(
      api.mutation('SubmitStatlines', ({ variables }) => {
        seen(variables);
        return gqlData({ submitStatlines: { ok: true } });
      }),
    );

    renderWithClient(
      <MultiStatlineTracker players={players} activity={activity} />,
    );

    // a stat "+" button (FGM, 3PM, …) is a form change
    await user.click(screen.getAllByRole('button', { name: /\+$/ })[0]);
    await user.click(screen.getByRole('button', { name: /save stats/i }));

    await vi.waitFor(() => expect(seen).toHaveBeenCalled());
    const { input } = seen.mock.calls[0][0] as {
      input: { routeKey: string; players: unknown[] };
    };
    expect(input).toMatchObject({ routeKey: 'team-1' });
    expect(input.players).toHaveLength(1);
  });
});
