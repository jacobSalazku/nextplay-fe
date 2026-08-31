import 'server-only';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print, type DocumentNode } from 'graphql/language';
import { getServerSession } from 'next-auth';
import { authServerOptions } from '@/lib/auth/server-options';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export type GraphQLFetchOptions = {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export type ExecuteGraphQLOptions = {
  emptyDataMessage?: string;
  accessToken?: string;
  skipAuth?: boolean;
  fetchOptions?: GraphQLFetchOptions;
};

/**
 * The single server-side GraphQL transport. Runs during RSC render / route
 * handlers only. Client components go through Server Actions, never this.
 */
export async function executeGraphQL<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  options?: ExecuteGraphQLOptions,
): Promise<TData> {
  let accessToken = options?.accessToken;

  if (!accessToken && !options?.skipAuth) {
    const session = await getServerSession(authServerOptions);
    accessToken = session?.accessToken as string | undefined;
  }

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      query: print(document as unknown as DocumentNode),
      variables,
    }),
    cache: options?.fetchOptions?.cache ?? 'no-store',
    ...(options?.fetchOptions?.next && {
      next: options.fetchOptions.next,
    }),
  });

  const json = (await res.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  if (!json.data) {
    throw new Error(
      options?.emptyDataMessage ?? 'GraphQL request returned no data',
    );
  }

  return json.data;
}
