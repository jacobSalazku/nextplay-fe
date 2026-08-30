import {
  graphql,
  HttpResponse,
  type GraphQLResponseBody,
  type StrictResponse,
} from 'msw';

/** Matches the endpoint gqlRequest / executeGraphQL post to. */
export const api = graphql.link('http://localhost:3001/graphql');

type GqlBody = GraphQLResponseBody<Record<string, unknown>>;

// MSW pins its GraphQL error type to `Partial<GraphQLError>` from a copy of the
// `graphql` package that doesn't structurally match the one this repo resolves
// under `moduleResolution: bundler`. The response JSON is correct — this only
// bridges that type skew.
const gqlResponse = (
  body: { data?: unknown } | { errors: { message: string }[] },
): StrictResponse<GqlBody> =>
  HttpResponse.json(body) as unknown as StrictResponse<GqlBody>;

export const gqlData = (data: unknown) => gqlResponse({ data });

export const gqlError = (message: string) =>
  gqlResponse({ errors: [{ message }] });

/**
 * Default handlers. Individual tests override with `server.use(...)`.
 * `onUnhandledRequest: 'error'` (in test/setup.ts) makes a missing handler
 * a loud failure rather than a silent hang.
 */
export const handlers = [
  api.operation(() => gqlError('No mock handler for this operation')),
];
