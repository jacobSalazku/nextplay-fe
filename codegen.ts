import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const endpoint = process.env.BACKEND_GRAPHQL_URL;

if (!endpoint) {
  throw new Error('BACKEND_GRAPHQL_URL env var is not set');
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
  config: {
    // The backend serialises Date scalars as ISO strings over the wire.
    // Without this they generate as `any`, silently untyping every
    // createdAt / date / updatedAt on the frontend.
    scalars: { DateTime: 'string' },
  },
  generates: {
    './graphql/': {
      preset: 'client',
    },
  },
};

export default config;
