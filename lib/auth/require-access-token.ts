import 'server-only';

import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const requireSession = cache(async () => {
  const session = await getServerSession(authOptions);

  const hasSessionError =
    !!session &&
    'error' in session &&
    typeof session.error === 'string' &&
    session.error.length > 0;

  if (!session?.accessToken || hasSessionError) {
    redirect('/login?error=SessionExpired');
  }

  return session;
});

export const requireAccessToken = cache(async () => {
  const session = await requireSession();
  return session.accessToken;
});

export const requireNotOnboarded = cache(async () => {
  const session = await requireSession();
  if (session.user?.hasOnBoarded) {
    redirect('/club');
  }

  return session;
});
