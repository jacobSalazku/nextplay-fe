import { MutationObserver } from '@tanstack/react-query';
import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createQueryClient } from '@/lib/graphql/query-client';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

/** Run one mutation through the client's shared MutationCache. */
async function runFailingMutation(
  reason: unknown,
  meta?: { skipGlobalErrorToast?: boolean },
) {
  const client = createQueryClient();
  const observer = new MutationObserver(client, {
    mutationFn: () => Promise.reject(reason),
    meta,
  });
  await observer.mutate().catch(() => undefined);
}

describe('createQueryClient — global mutation error handling', () => {
  afterEach(() => vi.clearAllMocks());

  it('toasts the error message on any mutation failure', async () => {
    await runFailingMutation(new Error('Not a coach'));

    expect(toast.error).toHaveBeenCalledWith(
      'Not a coach',
      expect.objectContaining({ position: 'top-right' }),
    );
  });

  it('falls back to a generic message for a non-Error rejection', async () => {
    await runFailingMutation('a bare string');

    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong',
      expect.anything(),
    );
  });

  it('skips the toast (but still logs) when meta.skipGlobalErrorToast is set', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await runFailingMutation(new Error('handled inline'), {
      skipGlobalErrorToast: true,
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logs the error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const err = new Error('boom');

    await runFailingMutation(err);

    expect(spy).toHaveBeenCalledWith(err);
    spy.mockRestore();
  });

  it('does not toast on a successful mutation', async () => {
    const client = createQueryClient();
    const observer = new MutationObserver(client, {
      mutationFn: () => Promise.resolve('ok'),
    });
    await observer.mutate();

    expect(toast.error).not.toHaveBeenCalled();
  });
});
