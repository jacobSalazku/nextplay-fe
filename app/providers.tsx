'use client';

import { apolloClient } from '../lib/apollo/apollo-client';
import { ApolloProvider } from '@apollo/client/react';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </SessionProvider>
  );
}
