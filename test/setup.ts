import '@testing-library/jest-dom/vitest';
import { createElement, type ImgHTMLAttributes } from 'react';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './msw/server';

// jsdom gaps that Radix-based components (radio groups, dialogs, …) touch.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
if (!window.matchMedia) {
  window.matchMedia = (query) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// next/image pulls in the whole Next image pipeline; a plain <img> is enough
// for behaviour tests and doesn't depend on the Next runtime.
vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) =>
    createElement('img', { ...props, alt: props.alt ?? '' }),
}));

// @sentry/nextjs pulls its build-time bundler plugins in through the package
// entry, which throw under vitest's resolver. Tests only need the call surface.
vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureRouterTransitionStart: vi.fn(),
  captureRequestError: vi.fn(),
}));

// A logged-in session, so getSession() / useSession() don't try to hit
// /api/auth/session (which MSW would then reject as unhandled).
vi.mock('next-auth/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-auth/react')>();
  const session = { user: { id: 'u1' } };
  return {
    ...actual,
    getSession: vi.fn(() => Promise.resolve(session)),
    useSession: vi.fn(() => ({
      data: session,
      status: 'authenticated',
      update: vi.fn(() => Promise.resolve(session)),
    })),
  };
});

// A request with no matching handler is a test bug, not a silent pass.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
