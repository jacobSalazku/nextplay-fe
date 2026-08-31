import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertServerEnv, findMissingEnv } from '@/lib/env-check';

describe('findMissingEnv', () => {
  it('returns nothing when both required vars are set', () => {
    expect(
      findMissingEnv({ BACKEND_GRAPHQL_URL: 'x', AUTH_SECRET: 'y' }),
    ).toEqual([]);
  });

  it('accepts NEXTAUTH_SECRET in place of AUTH_SECRET', () => {
    expect(
      findMissingEnv({ BACKEND_GRAPHQL_URL: 'x', NEXTAUTH_SECRET: 'y' }),
    ).toEqual([]);
  });

  it('lists what is missing', () => {
    expect(findMissingEnv({})).toEqual(['BACKEND_GRAPHQL_URL', 'AUTH_SECRET']);
  });
});

describe('assertServerEnv', () => {
  it('throws a message pointing at .env.example', () => {
    expect(() => assertServerEnv({ AUTH_SECRET: 'y' })).toThrow(
      /BACKEND_GRAPHQL_URL.*\.env\.example/,
    );
  });

  it('does not throw when the environment is complete', () => {
    expect(() =>
      assertServerEnv({ BACKEND_GRAPHQL_URL: 'x', AUTH_SECRET: 'y' }),
    ).not.toThrow();
  });
});

describe('instrumentation register()', () => {
  const original = { ...process.env };
  afterEach(() => {
    process.env = { ...original };
    vi.resetModules();
  });

  it('throws at boot in the node runtime when a required var is missing', async () => {
    process.env.NEXT_RUNTIME = 'nodejs';
    delete process.env.BACKEND_GRAPHQL_URL;
    const { register } = await import('../../instrumentation');

    expect(() => register()).toThrow(/BACKEND_GRAPHQL_URL/);
  });

  it('is a no-op outside the node runtime', async () => {
    process.env.NEXT_RUNTIME = 'edge';
    delete process.env.BACKEND_GRAPHQL_URL;
    const { register } = await import('../../instrumentation');

    expect(() => register()).not.toThrow();
  });
});
