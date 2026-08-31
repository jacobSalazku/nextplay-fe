'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/feedback/error-state';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: forward to a telemetry service (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-slate-950">
      <ErrorState onRetry={reset} />
    </main>
  );
}
