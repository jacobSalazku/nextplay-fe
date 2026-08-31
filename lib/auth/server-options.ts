import 'server-only';
import { type AuthOptions, type Session } from 'next-auth';
import { authOptions } from './options';

/**
 * Server-only auth options. Identical to `authOptions` except the `session`
 * callback also copies the access token onto the session, so RSC / route
 * handlers can read it via `getServerSession(authServerOptions)`.
 *
 * Never pass this to `NextAuth()` — the `/api/auth/[...nextauth]` route must
 * keep using `authOptions`, which withholds the token from client-visible
 * `/api/auth/session` responses.
 */
export const authServerOptions: AuthOptions = {
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async session(params) {
      const session = (await authOptions.callbacks!.session!(
        params,
      )) as Session;
      session.accessToken = params.token.accessToken;
      return session;
    },
  },
};
