import { authOptions } from '../auth/options';
import { OperationVariables, TypedDocumentNode } from '@apollo/client';
import { print } from '@apollo/client/utilities';
import { getServerSession } from 'next-auth';
import { createApolloClient } from './server-client';

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
    const session = await getServerSession(authOptions);
    accessToken = session?.accessToken as string | undefined;
  }

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      query: print(document),
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

export async function performMutation<
  TData,
  TVariables extends OperationVariables,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const client = await createApolloClient();

  const { data } = await client.mutate<TData, TVariables>({
    mutation: document,
    variables,
  });

  if (!data) {
    throw new Error('No data returned from mutation');
  }

  return data as TData;
}

export const performGraphQLRequest = executeGraphQL;
export const performGraphQLMutation = performMutation;
