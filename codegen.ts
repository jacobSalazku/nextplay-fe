import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT env var is not set');
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [endpoint],
  documents: [
    'app/**/*.{gql,graphql}',
    'features/**/*.{ts,tsx,graphql,gql}',
    'api/**/*.{gql,graphql}',
  ],
  ignoreNoDocuments: true,
  generates: {
    './graphql/': {
      preset: 'client',
    },
  },
};

export default config;
