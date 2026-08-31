import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { getToken } from 'next-auth/jwt';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-auth/jwt', () => ({ getToken: vi.fn() }));

const mockToken = vi.mocked(getToken);

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const post = (body: unknown, headers?: Record<string, string>) =>
  new NextRequest('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

const QUERY = { query: '{ me { id } }', variables: {} };

describe('POST /api/graphql', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    mockToken.mockReset();
  });

  it('rejects a non-POST method', async () => {
    const res = GET();
    expect(res.status).toBe(405);
  });

  it('401s when there is no session token', async () => {
    mockToken.mockResolvedValue(null);

    const res = await POST(post(QUERY));

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toMatchObject({
      errors: [{ message: expect.stringMatching(/not authenticated/i) }],
    });
  });

  it('401s when the token carries a refresh error', async () => {
    mockToken.mockResolvedValue({
      accessToken: 'stale',
      error: 'RefreshAccessTokenError',
    });

    const res = await POST(post(QUERY));

    expect(res.status).toBe(401);
  });

  it('403s a cross-origin caller', async () => {
    mockToken.mockResolvedValue({ accessToken: 'good' });

    const res = await POST(post(QUERY, { origin: 'https://evil.example' }));

    expect(res.status).toBe(403);
  });

  it('forwards the body with a bearer header and pipes the response back', async () => {
    mockToken.mockResolvedValue({ accessToken: 'good-token' });
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(jsonResponse({ data: { me: { id: 'u1' } } })),
    );
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(
      post(QUERY, { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ data: { me: { id: 'u1' } } });

    const init = fetchMock.mock.calls[0]![1]!;
    const headers = new Headers(init.headers);
    expect(headers.get('authorization')).toBe('Bearer good-token');
    expect(headers.get('x-forwarded-for')).toBe('203.0.113.7');
    expect(init.body).toBe(JSON.stringify(QUERY));
  });

  it('passes a backend error status straight through', async () => {
    mockToken.mockResolvedValue({ accessToken: 'good' });
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({ errors: [{ message: 'Too many requests' }] }, 429),
        ),
      ),
    );

    const res = await POST(post(QUERY));

    expect(res.status).toBe(429);
    await expect(res.json()).resolves.toMatchObject({
      errors: [{ message: 'Too many requests' }],
    });
  });

  it('502s when the backend is unreachable', async () => {
    mockToken.mockResolvedValue({ accessToken: 'good' });
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('ECONNREFUSED'))),
    );

    const res = await POST(post(QUERY));

    expect(res.status).toBe(502);
  });
});
