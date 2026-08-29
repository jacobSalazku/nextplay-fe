import { type Account, type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import {
  DevLoginDocument,
  LoginWithGoogleDocument,
  RefreshDocument,
} from '@/graphql/graphql';
import { authMutation } from './auth';

type BackendAuthPayload = {
  accessToken: string;
  refreshToken: string;
  hasOnBoarded: boolean;
  userId: string;
};

/**
 * Trades a completed provider sign-in for a backend session.
 *
 * Google: forward the ID token; the backend verifies its signature and
 * audience with Google and derives the email from the verified claims.
 * Credentials: dev-only email login, forwarded to the guarded devLogin
 * mutation.
 */
async function exchangeProviderSession(
  account: Account,
  signInEmail: string | undefined,
): Promise<BackendAuthPayload | null> {
  if (account.provider === 'google') {
    const idToken =
      typeof account.id_token === 'string' ? account.id_token : undefined;
    if (!idToken) return null;

    const data = await authMutation(LoginWithGoogleDocument, { idToken });
    return data.loginWithGoogle;
  }

  if (account.provider === 'credentials' && signInEmail) {
    const data = await authMutation(DevLoginDocument, {
      email: signInEmail.trim().toLowerCase(),
    });
    return data.devLogin;
  }

  return null;
}

const REFRESH_SKEW_MS = 30_000;
const DEV_AUTH_ENABLED =
  process.env.NODE_ENV !== 'production' &&
  (process.env.DEV_AUTH_ENABLED === 'true' ||
    process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED === 'true');
const GOOGLE_AUTH_ENABLED = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

const providers: NonNullable<AuthOptions['providers']> = [];

if (GOOGLE_AUTH_ENABLED) {
  providers.push(
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  );
}

if (DEV_AUTH_ENABLED) {
  providers.push(
    CredentialsProvider({
      name: 'Dev Email Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === 'string'
            ? credentials.email.trim().toLowerCase()
            : '';

        if (!email) return null;

        return {
          id: email,
          email,
          name: email.split('@')[0],
        };
      },
    }),
  );
}

if (providers.length === 0) {
  throw new Error(
    'No auth provider configured. Enable Google auth or set DEV_AUTH_ENABLED=true in development.',
  );
}

function getExpMs(accessToken?: string): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split('.')[1];
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    async jwt({ token, account, profile, user, trigger, session }) {
      // first login
      const signInEmail =
        (typeof profile?.email === 'string' ? profile.email : undefined) ??
        (typeof user?.email === 'string' ? user.email : undefined);

      if (account) {
        const authPayload = await exchangeProviderSession(account, signInEmail);

        if (!authPayload) {
          return {
            ...token,
            accessToken: undefined,
            error: 'ProviderExchangeFailed',
          };
        }

        return {
          ...token,
          accessToken: authPayload.accessToken,
          refreshToken: authPayload.refreshToken,
          accessTokenExpires: getExpMs(authPayload.accessToken),
          hasOnBoarded: authPayload.hasOnBoarded,
          userId: authPayload.userId,
          error: undefined,
        };
      }

      if (trigger === 'update') {
        const updatedHasOnBoarded =
          typeof (
            session as { hasOnBoarded?: unknown } | undefined
          )?.hasOnBoarded === 'boolean'
            ? (session as { hasOnBoarded: boolean }).hasOnBoarded
            : undefined;

        if (typeof updatedHasOnBoarded === 'boolean') {
          return {
            ...token,
            hasOnBoarded: updatedHasOnBoarded,
          };
        }
      }

      // token still valid
      const expMs = token.accessTokenExpires ?? getExpMs(token.accessToken);

      if (token.accessToken && expMs && Date.now() < expMs - REFRESH_SKEW_MS) {
        return token;
      }

      // refresh needed
      if (!token.refreshToken) {
        return { ...token, accessToken: undefined, error: 'NoRefreshToken' };
      }

      try {
        const data = await authMutation(RefreshDocument, {
          refreshToken: token.refreshToken,
        });

        return {
          ...token,
          accessToken: data.refresh.accessToken,
          refreshToken: data.refresh.refreshToken,
          accessTokenExpires: getExpMs(data.refresh.accessToken),
          hasOnBoarded: data.refresh.hasOnBoarded,
          userId: data.refresh.userId,
          error: undefined,
        };
      } catch {
        return {
          ...token,
          accessToken: undefined,
          error: 'RefreshAccessTokenError',
        };
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;

      if (session.user) {
        session.user.id = token.userId;
        session.user.hasOnBoarded = token.hasOnBoarded;
      }
      return session;
    },
  },
};
