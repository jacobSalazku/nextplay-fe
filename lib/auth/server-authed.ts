import 'server-only';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  type ExecuteGraphQLOptions,
  executeGraphQL,
} from '@/lib/graphql/execute';
import { requireAccessToken } from './require-access-token';

/**
 * Server-side GraphQL call that guarantees an authenticated session, redirecting
 * to /login if the token is missing or errored. Use from RSC / route handlers.
 */
export async function executeAuthedGraphQL<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  options?: Omit<ExecuteGraphQLOptions, 'accessToken' | 'skipAuth'>,
): Promise<TData> {
  const accessToken = await requireAccessToken();
  return executeGraphQL(document, variables, { ...options, accessToken });
}
