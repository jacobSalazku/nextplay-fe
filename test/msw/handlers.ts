import { graphql, HttpResponse, type StrictResponse } from 'msw';

/** Matches the endpoint gqlRequest / executeGraphQL post to. */
export const api = graphql.link('http://localhost:3001/graphql');

// MSW types a GraphQL resolver's return around the real `GraphQLError` class,
// which rejects a plain `{ message }`. These helpers build the same JSON and
// hand back a response the resolver signature accepts.
const asResolverResponse = (body: Record<string, unknown>) =>
  HttpResponse.json(body) as unknown as StrictResponse<never>;

export const gqlData = (data: unknown) => asResolverResponse({ data });

export const gqlError = (message: string) =>
  asResolverResponse({ errors: [{ message }] });

/**
 * Default handlers. Individual tests override with `server.use(...)`.
 * `onUnhandledRequest: 'error'` (in test/setup.ts) makes a missing handler
 * a loud failure rather than a silent hang.
 */
export const handlers = [
  api.operation(() => gqlError('No mock handler for this operation')),
];
