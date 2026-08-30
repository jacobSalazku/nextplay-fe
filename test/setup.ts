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

// A request with no matching handler is a test bug, not a silent pass.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

beforeEach(() => setGraphqlToken('test-token'));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  setGraphqlToken(undefined);
});

afterAll(() => server.close());
