'use client';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print, type DocumentNode } from 'graphql/language';
import { resolveGraphqlToken } from './client-token';

const GRAPHQL_ENDPOINT: string = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? '';
if (!GRAPHQL_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set');
}

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: { message: string }[];
};

// NestJS error body: auth guards, throttler, 5xx.
type HttpErrorBody = {
  message?: string | string[];
  error?: string;
};

/`print` is pure per document — cache it so hot mutations don't re-serialise.
const printCache = new WeakMap<object, string>();

function printDocument(document: object): string {
  let query = printCache.get(document);
  if (query === undefined) {
    // branded TypedDocumentNode isn't structurally a DocumentNode for `print`
    query = print(document as unknown as DocumentNode);
    printCache.set(document, query);
  }
  return query;
}

// Read the body once; tolerate empty or non-JSON.
async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text; // proxy HTML error page, gateway timeout, etc.
  }
}

function httpErrorMessage(status: number, body: unknown): string {
  if (body && typeof body === 'object') {
    const { message, error } = body as HttpErrorBody;
    if (Array.isArray(message) && message.length) return message.join(', ');
    if (typeof message === 'string' && message) return message;
    if (typeof error === 'string' && error) return error;
  }
  if (typeof body === 'string' && body.trim()) return body.trim();
  return `Request failed (${status})`;
}

/**
 The single client-side GraphQL transport for TanStack Query
 `mutationFn` / `queryFn`. Always throws `Error(message)` on failure so
 `useMutation`'s `onError` can surface it directly.
 */
export async function gqlRequest<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const token = await resolveGraphqlToken();

  let res: Response;
  try {
    res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query: printDocument(document),
        variables,
      }),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  const body = await readBody(res);
  const json: GraphQLResponse<TData> =
    body && typeof body === 'object' ? (body as GraphQLResponse<TData>) : {};

  // a GraphQL error envelope may arrive with 200 or 400
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }
  // any other non-2xx: HTTP-layer rejection, no GraphQL envelope
  if (!res.ok) {
    throw new Error(httpErrorMessage(res.status, body));
  }
  if (json.data == null) {
    throw new Error('GraphQL request returned no data.');
  }

  return json.data;
}
