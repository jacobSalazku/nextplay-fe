import { NextRequest } from 'next/server';
import { proxy } from '../proxy';
import { getToken } from 'next-auth/jwt';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-auth/jwt', () => ({ getToken: vi.fn() }));

const mockToken = vi.mocked(getToken);

const request = (path: string) =>
  new NextRequest(`http://localhost:3000${path}`);

describe('proxy middleware — /api/graphql', () => {
  afterEach(() => mockToken.mockReset());

  it('401s an unauthenticated GraphQL call instead of redirecting', async () => {
    mockToken.mockResolvedValue(null);

    const res = await proxy(request('/api/graphql'));

    expect(res.status).toBe(401);
    expect(res.headers.get('location')).toBeNull();
  });

  it('lets an authenticated GraphQL call through without the onboarding gate', async () => {
    mockToken.mockResolvedValue({ accessToken: 'good', hasOnBoarded: false });

    const res = await proxy(request('/api/graphql'));

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('still redirects an unauthenticated page visit to /login', async () => {
    mockToken.mockResolvedValue(null);

    const res = await proxy(request('/team/x/schedule'));

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login');
  });
});
