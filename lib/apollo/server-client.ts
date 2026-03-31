import { authOptions } from '../auth/options';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { getServerSession } from 'next-auth';

export async function createApolloClient() {
  const session = await getServerSession(authOptions);

  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      headers: {
        Authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : '',
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
