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

  const hasOnBoarded =
    token && typeof token.hasOnBoarded === 'boolean'
      ? token.hasOnBoarded
      : false;

  // The GraphQL proxy is an API endpoint — answer with a status code, never a
  // redirect, and don't apply the onboarding gate.
  if (pathname.startsWith('/api/graphql')) {
    if (!hasValidSession) {
      return NextResponse.json(
        { errors: [{ message: 'Not authenticated' }] },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith('/login');
  const isCreatePage = pathname === '/create';
  const isOnboardingPage = pathname.startsWith('/create/onboarding');
  const isJoinOrCreateTeamPage =
    pathname.startsWith('/create/join-team') ||
    pathname.startsWith('/create/create-team');
  const isCreateFlowRoute =
    isCreatePage || isOnboardingPage || isJoinOrCreateTeamPage;

  const isProtectedPage =
    pathname.startsWith('/club') ||
    pathname.startsWith('/team') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/teams') ||
    pathname.startsWith('/create');

  // Not logged in block protected
  if (isProtectedPage && !hasValidSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Logged in redirect away from login
  if (isAuthPage && hasValidSession) {
    return NextResponse.redirect(new URL('/club', request.url));
  }

  // NOT onboarded → only create flow routes are allowed.
  if (hasValidSession && !hasOnBoarded && !isCreateFlowRoute) {
    return NextResponse.redirect(new URL('/create', request.url));
  }

  // keep onboarding entry pages blocked, but still allow join/create team pages later.
  if (hasValidSession && hasOnBoarded && (isCreatePage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/club', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/create',
    '/club/:path*',
    '/team/:path*',
    '/dashboard/:path*',
    '/teams/:path*',
    '/create/:path*',
    '/api/graphql',
  ],
};
