import { getSession } from 'next-auth/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { gqlRequest } from '@/lib/graphql/client-request';
import { CreatePlayDocument } from '@/graphql/graphql';

// A minimal fetch stub we can point at any Response per test.
function stubFetch(impl: () => Promise<Response> | Response) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(impl()));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const INPUT = {
  name: 'Play',
  description: '',
  category: 'OFFENSIVE',
  canvas: '',
  routeKey: 'team-1',
} as never;

describe('gqlRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(getSession).mockClear();
  });

  it('returns data on a successful response', async () => {
    stubFetch(() => jsonResponse({ data: { createPlay: { id: 'p1' } } }));

    await expect(gqlRequest(CreatePlayDocument, INPUT)).resolves.toEqual({
      createPlay: { id: 'p1' },
    });
  });

  it('posts to the same-origin proxy with no auth header', async () => {
    const fetchMock = stubFetch(() =>
      jsonResponse({ data: { createPlay: {} } }),
    );

    await gqlRequest(CreatePlayDocument, INPUT);

    expect(fetchMock.mock.calls[0][0]).toBe('/api/graphql');
    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get('authorization')).toBeNull();
  });

  it('refreshes the session and retries once on a 401', async () => {
    let call = 0;
    const fetchMock = stubFetch(() => {
      call += 1;
      return call === 1
        ? jsonResponse({ errors: [{ message: 'Not authenticated' }] }, 401)
        : jsonResponse({ data: { createPlay: { id: 'p1' } } });
    });

    await expect(gqlRequest(CreatePlayDocument, INPUT)).resolves.toEqual({
      createPlay: { id: 'p1' },
    });

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up after one failed retry on a 401', async () => {
    stubFetch(() =>
      jsonResponse({ errors: [{ message: 'Not authenticated' }] }, 401),
    );

    await expect(gqlRequest(CreatePlayDocument, INPUT)).rejects.toThrow(
      /not authenticated/i,
    );
  });

  it('throws the GraphQL error message (joined)', async () => {
    stubFetch(() =>
      jsonResponse({ errors: [{ message: 'Boom' }, { message: 'Also boom' }] }),
    );

    await expect(gqlRequest(CreatePlayDocument, INPUT)).rejects.toThrow(
      'Boom, Also boom',
    );
  });

  it('surfaces a NestJS { message } body on a non-2xx response', async () => {
    stubFetch(() =>
      jsonResponse({ statusCode: 403, message: 'Forbidden' }, 403),
    );

    await expect(gqlRequest(CreatePlayDocument, INPUT)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('does not choke on a non-JSON error body', async () => {
    stubFetch(
      () =>
        new Response('<html>502 Bad Gateway</html>', {
          status: 502,
          headers: { 'content-type': 'text/html' },
        }),
    );

    await expect(gqlRequest(CreatePlayDocument, INPUT)).rejects.toThrow(
      /502 Bad Gateway/,
    );
  });

  it('reports a network failure clearly', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));

    await expect(gqlRequest(CreatePlayDocument, INPUT)).rejects.toThrow(
      /network error/i,
    );
  });

  it('throws when a 2xx response carries no data', async () => {
    stubFetch(() => jsonResponse({}));

    await expect(gqlRequest(CreatePlayDocument, INPUT)).rejects.toThrow(
      /no data/i,
    );
  });
});
