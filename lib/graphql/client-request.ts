'use client';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print, type DocumentNode } from 'graphql/language';
import { getSession } from 'next-auth/react';

// Same-origin BFF proxy (app/api/graphql/route.ts) attaches the bearer token
// server-side from the session cookie — the browser never holds it.
const PROXY_ENDPOINT = '/api/graphql';

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: { message: string }[];
};

// NestJS error body: auth guards, throttler, 5xx.
type HttpErrorBody = {
  message?: string | string[];
  error?: string;
};

// `print` is pure per document — cache it so hot mutations don't re-serialise.
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

async function postToProxy(body: string): Promise<Response> {
  try {
    return await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }
}

// The single client-side GraphQL transport for TanStack Query mutationFn /
// queryFn. Always throws Error(message) on failure so useMutation's onError
// can surface it directly.
export async function gqlRequest<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> {
  const payload = JSON.stringify({
    query: printDocument(document),
    variables,
  });

  let res = await postToProxy(payload);

  // The proxy 401s when the cookie's access token is missing/expired. Ask
  // next-auth to refresh it (that route re-issues the cookie), then retry once.
  if (res.status === 401) {
    await getSession();
    res = await postToProxy(payload);
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
