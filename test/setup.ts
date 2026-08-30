import '@testing-library/jest-dom/vitest';
import { createElement, type ImgHTMLAttributes } from 'react';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { setGraphqlToken } from '@/lib/graphql/client-token';
import { server } from './msw/server';

// next/image pulls in the whole Next image pipeline; a plain <img> is enough
// for behaviour tests and doesn't depend on the Next runtime.
vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) =>
    createElement('img', { ...props, alt: props.alt ?? '' }),
}));

// A logged-in session, so getSession() / useSession() don't try to hit
// /api/auth/session (which MSW would then reject as unhandled).
vi.mock('next-auth/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-auth/react')>();
  const session = { accessToken: 'test-token', user: { id: 'u1' } };
  return {
    ...actual,
    getSession: vi.fn(() => Promise.resolve(session)),
    useSession: vi.fn(() => ({ data: session, status: 'authenticated' })),
  };
});

// A request with no matching handler is a test bug, not a silent pass.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

beforeEach(() => setGraphqlToken('test-token'));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  setGraphqlToken(undefined);
});

afterAll(() => server.close());
