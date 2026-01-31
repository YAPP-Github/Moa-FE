import 'dotenv/config';
import { defineConfig } from 'orval';

export default defineConfig({
  moa: {
    input: {
      target: `${process.env.VITE_API_BASE_URL}/api-docs/openapi.json`,
    },
    output: {
      mode: 'single',
      target: './src/shared/api/generated/index.ts',
      client: 'axios',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/shared/api/instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
