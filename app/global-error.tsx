'use client';

import { useEffect } from 'react';

/**
 * Catches errors thrown by the root layout itself. It replaces `<html>`, so it
 * has no access to providers, fonts or global CSS — everything is inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '1rem',
        }}
      >
        <div style={{ maxWidth: '24rem', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#fdba74',
              margin: 0,
            }}
          >
            Something broke
          </p>
          <h1 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0' }}>
            The app failed to load
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.55)',
              margin: '0.5rem 0 0',
            }}
          >
            Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              height: 40,
              padding: '0 1.5rem',
              border: 0,
              borderRadius: 999,
              background: '#fb923c',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
