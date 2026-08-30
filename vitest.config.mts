import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // resolves the `@/*` aliases from tsconfig.json
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
    // client-request.ts throws at import if this is unset
    env: {
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: 'http://localhost:3001/graphql',
    },
  },
});
