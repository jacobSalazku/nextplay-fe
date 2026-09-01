'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import '@/styles/globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-sm text-center">
          <p className="text-xs font-medium tracking-[0.24em] text-orange-300 uppercase">
            Something broke
          </p>
          <h1 className="mt-2 text-2xl">The app failed to load</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-10 rounded-full bg-orange-400 px-6 text-sm text-white hover:bg-orange-400/90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
