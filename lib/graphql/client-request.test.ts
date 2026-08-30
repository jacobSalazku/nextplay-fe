import { afterEach, describe, expect, it, vi } from 'vitest';
import { CreatePlayDocument } from '@/graphql/graphql';
import { gqlRequest } from './client-request';

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
  });

  it('returns data on a successful response', async () => {
    stubFetch(() => jsonResponse({ data: { createPlay: { id: 'p1' } } }));

    await expect(gqlRequest(CreatePlayDocument, INPUT)).resolves.toEqual({
      createPlay: { id: 'p1' },
    });
  });

  it('sends the bearer token', async () => {
    const fetchMock = stubFetch(() =>
      jsonResponse({ data: { createPlay: {} } }),
    );

    await gqlRequest(CreatePlayDocument, INPUT);

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get('authorization')).toBe('Bearer test-token');
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
