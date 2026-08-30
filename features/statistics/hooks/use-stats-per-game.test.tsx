import { api, gqlData, gqlError } from '../../../test/msw/handlers';
import { server } from '../../../test/msw/server';
import { renderHookWithClient } from '../../../test/utils';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStatsPerGame } from './use-stats-per-game';

const COMPLETE = { routeKey: 'team-1', memberId: 'm1', month: 1, year: 2026 };

describe('useStatsPerGame', () => {
  it('skips the query until routeKey and memberId are both present', () => {
    const { result } = renderHookWithClient(() =>
      useStatsPerGame({ ...COMPLETE, routeKey: '', memberId: '' }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.statsPerGame).toEqual([]);
  });

  it('returns the rows once loaded', async () => {
    server.use(
      api.query('GetStatsPerGame', () =>
        gqlData({
          getStatsPerGame: [
            {
              gameTitle: 'vs Hawks',
              date: '2026-01-01',
              points: 12,
              assists: 4,
              rebounds: 6,
              steals: 2,
            },
          ],
        }),
      ),
    );

    const { result } = renderHookWithClient(() => useStatsPerGame(COMPLETE));

    await waitFor(() => expect(result.current.statsPerGame).toHaveLength(1));
    expect(result.current.statsPerGame[0].gameTitle).toBe('vs Hawks');
  });

  it('surfaces a GraphQL error', async () => {
    server.use(api.query('GetStatsPerGame', () => gqlError('boom')));

    const { result } = renderHookWithClient(() => useStatsPerGame(COMPLETE));

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.statsPerGame).toEqual([]);
  });
});
