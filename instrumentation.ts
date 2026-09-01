import * as Sentry from '@sentry/nextjs';
import { assertServerEnv } from '@/lib/env-check';

const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0,
};

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    assertServerEnv();
    Sentry.init(sentryOptions);
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(sentryOptions);
  }
}

export const onRequestError = Sentry.captureRequestError;
