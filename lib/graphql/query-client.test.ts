import { MutationObserver } from '@tanstack/react-query';
import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createQueryClient } from './query-client';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

/** Run one mutation through the client's shared MutationCache. */
async function runFailingMutation(reason: unknown) {
  const client = createQueryClient();
  const observer = new MutationObserver(client, {
    mutationFn: () => Promise.reject(reason),
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
