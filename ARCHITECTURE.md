# Architecture — nextplay-fe

Memory file for future work. Keep decisions here so we don't re-litigate them.

## Data layer

One rule: **the GraphQL operation type decides the mechanism.**

| Operation | Mechanism | Where |
|---|---|---|
| `query` | `executeGraphQL` / `executeAuthedGraphQL` (raw `fetch`, `server-only`) | `features/*/queries/*.ts`, called from Server Components; data flows down as props |
| `mutation` | TanStack Query `useMutation` + `gqlRequest` client fetch | `'use client'` components / feature hooks |

- **Reads are server-side.** RSC pages call the `queries/*.ts` functions. No client fetching for reads.
- **Writes are client-side** via `useMutation({ mutationFn: () => gqlRequest(SomeDocument, vars), onSuccess, onError })`.
- `gqlRequest` (`lib/graphql/client-request.ts`) is the single client transport. The access token is pushed into a module holder (`lib/graphql/client-token.ts`) by a `useSession()` effect in `app/providers.tsx` — **no `getSession()` network call per request**.
- Freshness after a mutation: `router.refresh()` (re-runs the RSC queries). `revalidatePath` / `revalidateTag` is a later refinement.

## Why TanStack Query, not Apollo or Server Actions

Apollo was removed (`@apollo/client` deleted). Its value is the normalized cache, and this app never used it — no `typePolicies`, no `cache.modify`, and `refetchQueries` calls that were no-ops because the queries are RSC-fetched.

Server Actions were the other candidate (smaller still, token fully server-side). **We chose TanStack Query because we expect to want client-cache features soon** — optimistic UI, polling, infinite scroll, live-ish data. The app shows none of those today (sockets were removed, nothing polls), but adding them later is trivial with TanStack in place and painful without it. TanStack is also ~⅓ the bundle of Apollo and was already a dependency.

Trade-off accepted: mutations stay client-side, so the access token remains in client JS. If we move to an httpOnly-cookie session later, `gqlRequest` switches to `credentials: 'include'` and drops the `Authorization` header.

## Auth

- `next-auth` (v4), JWT strategy, Google provider + a dev credentials provider.
- The backend issues its own RS256 access token; `next-auth`'s `jwt` callback trades the Google ID token for it via `loginWithGoogle`, and refreshes via `refresh`.
- `SessionProvider` wraps the app. Server reads get the token from `getServerSession`; client mutations get it from the module holder described above.
- `lib/auth/require-access-token.ts` redirects to `/login` when the session is missing/errored — used by `withProtectedPage` and `executeAuthedGraphQL`.

## Codegen

- `graphql-codegen` client preset → `graphql/`. `DateTime` scalar mapped to `string`.
- `pnpm codegen` regenerates against the live backend schema; `pnpm codegen:check` fails if `graphql.ts` / `gql.ts` drifted.
- Backend `nextplay-be` owns the schema; after any backend schema change, re-run `pnpm codegen`.

## CI

`.github/workflows/ci.yml` — lint, typecheck, `next build` on every push/PR. Optional cross-repo schema-drift check gated on a `NEXTPLAY_BE_TOKEN` secret.
