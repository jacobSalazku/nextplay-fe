'use client';

import { useEffect, useState } from 'react';
import { apolloClient } from '@/lib/apollo/apollo-client';
import { toastStyling } from '@/features/toast-notification/styling';
import { setGraphqlToken } from '@/lib/graphql/client-token';
import { ApolloProvider } from '@apollo/client/react';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import { toast } from 'sonner';

/** Keeps the module-level token in sync with the session — no network call. */
function GraphqlTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    setGraphqlToken(session?.accessToken);
  }, [session?.accessToken]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Every mutation failure toasts + logs from here, so individual
        // `useMutation` calls only add an `onError` for extra behaviour.
        mutationCache: new MutationCache({
          onError: (error) => {
            console.error(error);
            toast.error(
              error instanceof Error ? error.message : 'Something went wrong',
              { ...toastStyling, position: 'top-right' },
            );
          },
        }),
      }),
  );

  return (
    <SessionProvider refetchOnWindowFocus>
      <QueryClientProvider client={queryClient}>
        <GraphqlTokenSync />
        {/* ApolloProvider stays until every mutation is migrated to TanStack Query. */}
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
