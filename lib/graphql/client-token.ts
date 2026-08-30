'use client';

import { getSession } from 'next-auth/react';

/**
 * Access token for client-side GraphQL requests. Kept in sync by a
 * `useSession()` effect in `app/providers.tsx`, so the common path needs no
 * network call. `resolveGraphqlToken()` falls back to `getSession()` for the
 * brief window on first paint before that effect has run.
 *
 * Client-only — never import this from a Server Component.
 */
let accessToken: string | undefined;

export function setGraphqlToken(token: string | undefined): void {
  accessToken = token;
}

export async function resolveGraphqlToken(): Promise<string | undefined> {
  if (accessToken) return accessToken;

  const session = await getSession();
  accessToken = session?.accessToken;
  return accessToken;
}
