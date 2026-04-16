import 'server-only';

import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const requireAccessToken = cache(async () => {
  const session = await getServerSession(authOptions);
  
  const hasSessionError =
    !!session &&
    'error' in session &&
    typeof session.error === 'string' &&
    session.error.length > 0;

  if (!session?.accessToken || hasSessionError) {
    redirect('/login?error=SessionExpired');
  }

  if (session?.user?.hasOnBoarded === false) {
    redirect('/create');
  }

  return session.accessToken;
});


export const userHasOnBoarded = cache(async () => {
  const session = await getServerSession(authOptions);
  
  const hasSessionError =
    !!session &&
    'error' in session &&
    typeof session.error === 'string' &&
    session.error.length > 0;

  if (!session?.accessToken || hasSessionError) {
    redirect('/login?error=SessionExpired');
  }

  if (session?.user?.hasOnBoarded === true) {
    redirect('/club');
  }

  return session;
});
