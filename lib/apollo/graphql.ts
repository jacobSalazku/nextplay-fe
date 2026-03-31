import { authOptions } from '../auth/options';
import { OperationVariables, TypedDocumentNode } from '@apollo/client';
import { print } from '@apollo/client/utilities';
import { getServerSession } from 'next-auth';
import { createApolloClient } from './server-client';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};
export async function executeGraphQL<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  options?: {
    emptyDataMessage?: string;
    accessToken?: string;
    skipAuth?: boolean;
  },
): Promise<TData> {
  let accessToken = options?.accessToken;

  if (!accessToken && !options?.skipAuth) {
    const session = await getServerSession(authOptions);
    accessToken = session?.accessToken as string | undefined;
  }

  console.log('executeGraphQL accessToken:', accessToken ?? 'UNDEFINED');

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
    cache: 'no-store',
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
