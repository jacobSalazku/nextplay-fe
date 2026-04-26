import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const accessToken =
    token && typeof token.accessToken === 'string' ? token.accessToken : '';
  const tokenError =
    token && typeof token.error === 'string' ? token.error : undefined;

  const hasValidSession = Boolean(token && accessToken && !tokenError);
  const isAuthPage = pathname.startsWith('/login');
  const isProtectedPage =
    pathname.startsWith('/club') ||
    pathname.startsWith('/team') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/teams') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/api/graphql');

  const clearAuthCookies = (response: NextResponse) => {
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
  };

  if (isAuthPage && hasValidSession) {
    return NextResponse.redirect(new URL('/club', request.url));
  }

  // Stale/invalid token cookie: allow login page and clear cookie to stop loops.
  if (isAuthPage && token && !hasValidSession) {
    const response = NextResponse.next();
    clearAuthCookies(response);
    return response;
  }

  if (isProtectedPage && !hasValidSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'SessionExpired');
    const response = NextResponse.redirect(loginUrl);

    if (token && !hasValidSession) {
      clearAuthCookies(response);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/club/:path*',
    '/team/:path*',
    '/dashboard/:path*',
    '/teams/:path*',
    '/create/:path*',
    '/api/graphql',
  ],
};
