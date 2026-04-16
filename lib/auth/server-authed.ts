import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { performGraphQLRequest } from '../apollo/graphql';
import { requireAccessToken } from './require-acces-token';

export async function executeAuthedGraphQL<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const accessToken = await requireAccessToken();
  return performGraphQLRequest(document, variables, { accessToken });
}

export async function executeAuthedMutation<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const accessToken = await requireAccessToken();
  return performGraphQLRequest(document, variables, { accessToken });
}
