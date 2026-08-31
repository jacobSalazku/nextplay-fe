import { UpdateUserData } from '../zod';
import type { UpdateUserInput } from '@/graphql/graphql';

type SessionLike = { error?: string };
type SubmitParams = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  session: SessionLike | null | undefined;
  data: UpdateUserData;
  runUpdateUser: (input: UpdateUserInput) => Promise<unknown>;
  update: (data?: { hasOnBoarded: boolean }) => Promise<unknown>;
  router: {
    push: (url: string) => void;
    replace: (url: string) => void;
    refresh: () => void;
  };
  setError: (
    name: 'phone' | 'root',
    error: { type: 'server'; message: string },
  ) => void;
};

export async function submitUpdateUser({
  status,
  session,
  data,
  runUpdateUser,
  update,
  router,
  setError,
}: SubmitParams) {
  if (status === 'loading') {
    setError('root', {
      type: 'server',
      message: 'Session is still loading. Please try again.',
    });
    return;
  }

  if (status === 'unauthenticated' || !session || session.error) {
    router.push('/login?error=SessionExpired');
    return;
  }

  try {
    await runUpdateUser({
      ...data,
      height: Number(data.height),
      weight: Number(data.weight),
    });

    await update({ hasOnBoarded: true });
    router.replace('/club');
    router.refresh();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to update user';
    const normalized = message.toLowerCase();

    if (
      normalized.includes('phone') &&
      (normalized.includes('duplicate') ||
        normalized.includes('already in use'))
    ) {
      setError('phone', {
        type: 'server',
        message: 'Phone number is already in use.',
      });
      return;
    }

    setError('root', { type: 'server', message });
  }
}
