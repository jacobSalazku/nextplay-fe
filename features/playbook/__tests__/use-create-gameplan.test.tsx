import { useCreateGameplan } from '@/features/playbook/hooks/gameplan/use-create-gameplan';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { api, gqlData, gqlError } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithClient } from '@/test/utils';
import { waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh, push: vi.fn() }),
}));
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const PAYLOAD = {
  name: 'Zone attack',
  opponent: 'Hawks',
  notes: '',
  activityId: 'a1',
  playsId: [],
};

describe('useCreateGameplan', () => {
  afterEach(() => vi.clearAllMocks());

  it('on success: switches tab, closes, resets, refreshes and toasts', async () => {
    server.use(
      api.mutation('CreateGamePlan', () =>
        gqlData({ createGamePlan: { id: 'gp1' } }),
      ),
    );
    useCoachDashboardStore.setState({ activeCoachTab: 'practice' });
    const onClose = vi.fn();
    const resetForm = vi.fn();

    const { result } = renderHookWithClient(() =>
      useCreateGameplan('team-1', onClose, resetForm),
    );

    await result.current.mutateAsync(PAYLOAD);

    await waitFor(() => {
      expect(useCoachDashboardStore.getState().activeCoachTab).toBe('gameplan');
    });
    expect(onClose).toHaveBeenCalledOnce();
    expect(resetForm).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
    expect(toast.success).toHaveBeenCalledWith(
      'Your gameplan has been successfully created',
      expect.objectContaining({ position: 'top-right' }),
    );
  });

  it('sends routeKey merged into the input', async () => {
    const seen = vi.fn();
    server.use(
      api.mutation('CreateGamePlan', ({ variables }) => {
        seen(variables);
        return gqlData({ createGamePlan: { id: 'gp1' } });
      }),
    );

    const { result } = renderHookWithClient(() =>
      useCreateGameplan('team-42', vi.fn(), vi.fn()),
    );
    await result.current.mutateAsync(PAYLOAD);

    expect(seen).toHaveBeenCalledWith({
      input: { routeKey: 'team-42', ...PAYLOAD },
    });
  });

  it('rejects (and skips the success side effects) on a GraphQL error', async () => {
    server.use(api.mutation('CreateGamePlan', () => gqlError('Not a coach')));
    const onClose = vi.fn();

    const { result } = renderHookWithClient(() =>
      useCreateGameplan('team-1', onClose, vi.fn()),
    );

    await expect(result.current.mutateAsync(PAYLOAD)).rejects.toThrow(
      'Not a coach',
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
