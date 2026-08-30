'use client';

/**
 * Holds the current access token for client-side GraphQL mutations.
 * Populated by a `useSession()` effect in `app/providers.tsx`, so
 * `gqlRequest` never has to make a `getSession()` network call per request.
 */
let accessToken: string | undefined;

export function setGraphqlToken(token: string | undefined): void {
  accessToken = token;
}

export function getGraphqlToken(): string | undefined {
  return accessToken;
}
