import type { ReactNode } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react';

/** A fresh QueryClient per test, retries off so failures surface immediately. */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

/** A fresh Apollo client per test — no shared cache between tests. MSW handles the HTTP. */
function makeApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
    cache: new InMemoryCache(),
  });
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={makeApolloClient()}>
      <QueryClientProvider client={makeQueryClient()}>
        {children}
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export function renderWithClient(
  ui: ReactNode,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper, ...options });
}

export function renderHookWithClient<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) {
  return renderHook(hook, { wrapper, ...options });
}
