'use client';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type DocumentNode, print } from 'graphql/language';
import { getGraphqlToken } from './client-token';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

/**
 * The single client-side GraphQL transport, used by TanStack Query
 * `mutationFn` / `queryFn`. Throws `Error(message)` on a GraphQL error so
 * `useMutation`'s `onError` receives the real backend message.
 */
export async function gqlRequest<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const token = getGraphqlToken();

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: print(document as unknown as DocumentNode),
      variables,
    }),
  });

  const json = (await res.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (!json.data) {
    throw new Error('GraphQL request returned no data');
  }

  return json.data;
}
