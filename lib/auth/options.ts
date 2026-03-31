import { type AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { LoginDocument, RefreshDocument } from '@/graphql/graphql';
import { authMutation } from './auth';

const REFRESH_SKEW_MS = 30_000;

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
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // first login
      if (account && profile?.email) {
        const data = await authMutation(LoginDocument, {
          email: profile.email,
        });

        return {
          ...token,
          accessToken: data.login.accessToken,
          refreshToken: data.login.refreshToken,
          accessTokenExpires: getExpMs(data.login.accessToken),
          hasOnBoarded: data.login.hasOnBoarded,
          userId: data.login.userId,
          error: undefined,
        };
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
