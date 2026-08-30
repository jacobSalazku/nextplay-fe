'use client';

import { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import { apolloClient } from '@/lib/apollo/apollo-client';
import { setGraphqlToken } from '@/lib/graphql/client-token';
import { createQueryClient } from '@/lib/graphql/query-client';

/** Keeps the module-level token in sync with the session — no network call. */
function GraphqlTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    setGraphqlToken(session?.accessToken);
  }, [session?.accessToken]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

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
