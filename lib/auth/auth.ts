import { print } from '@apollo/client/utilities';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function authMutation<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    throw new Error('Auth mutation returned no data');
  }

  return json.data;
}
