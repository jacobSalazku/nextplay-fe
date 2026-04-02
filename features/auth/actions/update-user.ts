import { UpdateUserData } from '../zod';

type SessionLike = { accessToken?: string; error?: string };
type SubmitParams = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  session: SessionLike | null | undefined;
  data: UpdateUserData;
  runUpdateUser: (args: {
    variables: { input: UpdateUserData };
    context: { headers: { Authorization: string } };
  }) => Promise<unknown>;
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

  if (!session?.accessToken || session.error) {
    router.push('/login?error=SessionExpired');
    return;
  }

  try {
    await runUpdateUser({
      variables: {
        input: {
          ...data,
          height: Number(data.height),
          weight: Number(data.weight),
        },
      },
      context: {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      },
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
