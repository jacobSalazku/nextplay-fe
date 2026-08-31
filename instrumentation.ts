import { assertServerEnv } from '@/lib/env-check';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    assertServerEnv();
  }
}
