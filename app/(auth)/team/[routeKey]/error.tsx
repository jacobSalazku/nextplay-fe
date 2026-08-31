'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ErrorState } from '@/components/feedback/error-state';

export default function TeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ routeKey: string }>();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      onRetry={reset}
      title="Couldn't load this view"
      description="The team's data didn't come back. Retry, or go back to the schedule."
      homeHref={
        params?.routeKey ? `/team/${params.routeKey}/schedule` : '/club'
      }
      homeLabel="Back to schedule"
    />
  );
}
