import { load } from '@expo/env';
import { defineConfig } from 'orval';

process.env.NODE_ENV ??= 'development';
load(process.cwd());

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

if (!apiUrl) {
  throw new Error('Set EXPO_PUBLIC_API_URL before running api:gen');
}

export default defineConfig({
  haunt: {
    input: {
      target: `${apiUrl}/api-json`,
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/haunt.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customInstance',
        },
        query: {
          version: 5,
        },
      },
    },
  },
});
