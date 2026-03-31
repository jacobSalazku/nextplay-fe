import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isLoggedIn = !!token;
  const isAuthPage = pathname.startsWith('/login');
  const isProtectedPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/teams') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/api/graphql');

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/teams/:path*',
    '/create/:path*',
    '/api/graphql',
  ],
};
