import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Same-origin GraphQL proxy (BFF). The browser POSTs here with only its
 * session cookie; this handler reads the access token from the cookie
 * server-side and forwards the request to the backend with a bearer header.
 * The access token never reaches client JavaScript.
 *
 * Refresh is NOT done here — a route handler can't persist a rotated refresh
 * token back to the next-auth cookie. On a 401 the client calls `getSession()`
 * (which hits `/api/auth/session` → refreshes + re-issues the cookie) and
 * retries once. See `lib/graphql/client-request.ts`.
 */

const BACKEND_GRAPHQL_URL = process.env.BACKEND_GRAPHQL_URL;
const AUTH_SECRET = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

function unauthenticated() {
  return NextResponse.json(
    { errors: [{ message: 'Not authenticated' }] },
    { status: 401 },
  );
}

function clientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? undefined;
}

export async function POST(req: NextRequest) {
  if (!BACKEND_GRAPHQL_URL) {
    return NextResponse.json(
      { errors: [{ message: 'BACKEND_GRAPHQL_URL is not set' }] },
      { status: 500 },
    );
  }

  // Cookie-authenticated endpoint: reject cross-origin callers outright.
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json(
      { errors: [{ message: 'Cross-origin request rejected' }] },
      { status: 403 },
    );
  }

  const token = await getToken({ req, secret: AUTH_SECRET });
  if (!token?.accessToken || token.error) {
    return unauthenticated();
  }

  const ip = clientIp(req);

  let backendRes: Response;
  try {
    backendRes = await fetch(BACKEND_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
        ...(ip ? { 'X-Forwarded-For': ip } : {}),
      },
      body: await req.text(),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      { errors: [{ message: 'Upstream GraphQL request failed' }] },
      { status: 502 },
    );
  }

  // Pass the backend's status and JSON body straight through so the client's
  // existing error handling (GraphQL envelope vs HTTP error) is unchanged.
  const body = await backendRes.text();
  return new NextResponse(body, {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function GET() {
  return NextResponse.json(
    { errors: [{ message: 'Method not allowed' }] },
    { status: 405 },
  );
}
