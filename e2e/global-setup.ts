import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { encode } from 'next-auth/jwt';

export const AUTH_FILE = path.join(__dirname, '.auth', 'coach.json');

const BACKEND =
  process.env.BACKEND_GRAPHQL_URL ?? 'http://localhost:3001/graphql';
// must match webServer.env.NEXTAUTH_SECRET in playwright.config.ts
const SECRET = 'playwright-only';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3100';
const COACH_EMAIL = 'coach.cavs@nextplay.test';

// Logs the seed coach in against the real backend and writes a Playwright
// storageState with a forged next-auth session cookie. If the backend is not
// reachable the file is not written; backend-dependent specs skip themselves.
export default async function globalSetup() {
  const payload = await devLogin();
  if (!payload) {
    console.warn(`[e2e] no backend at ${BACKEND} — skipping auth setup`);
    return;
  }

  const token = await encode({
    secret: SECRET,
    token: {
      sub: payload.userId,
      email: COACH_EMAIL,
      userId: payload.userId,
      hasOnBoarded: payload.hasOnBoarded,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    },
  });

  const { hostname } = new URL(BASE_URL);
  await mkdir(path.dirname(AUTH_FILE), { recursive: true });
  await writeFile(
    AUTH_FILE,
    JSON.stringify({
      cookies: [
        {
          name: 'next-auth.session-token',
          value: token,
          domain: hostname,
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          expires: Math.floor(Date.now() / 1000) + 60 * 60,
        },
      ],
      origins: [],
    }),
  );
}

async function devLogin() {
  const query = `mutation($email: String!) {
    devLogin(email: $email) {
      accessToken
      refreshToken
      hasOnBoarded
      userId
    }
  }`;

  try {
    const res = await fetch(BACKEND, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { email: COACH_EMAIL } }),
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: {
        devLogin: {
          accessToken: string;
          refreshToken: string;
          hasOnBoarded: boolean;
          userId: string;
        };
      };
    };
    return json.data?.devLogin ?? null;
  } catch {
    return null;
  }
}
