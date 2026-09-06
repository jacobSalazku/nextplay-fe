'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { ErrorState } from '@/components/feedback/error-state';

export default function EditPlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ routeKey: string }>();

  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorState
      onRetry={reset}
      title="Couldn't open the editor"
      description="This play didn't load. Retry, or go back to the playbook."
      homeHref={
        params?.routeKey ? `/team/${params.routeKey}/playbook` : '/club'
      }
      homeLabel="Back to playbook"
    />
  );
}
