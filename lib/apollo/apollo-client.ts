import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();

  return {
    headers: {
      ...headers,
      ...(session?.accessToken
        ? {
            Authorization: `Bearer ${session.accessToken}`,
          }
        : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});
