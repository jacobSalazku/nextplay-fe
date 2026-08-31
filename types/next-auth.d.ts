import { DefaultSession } from 'next-auth';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    /**
     * Server-only. Present when the session is read via
     * `getServerSession(authServerOptions)`; withheld from the client-facing
     * `/api/auth/session` response.
     */
    accessToken?: string;
    error?: AuthTokenError;
    user?: DefaultSession['user'] & {
      id?: string;
      hasOnBoarded?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number | null;
    error?: AuthTokenError;
    userId?: string;
    hasOnBoarded?: boolean;
  }
}
