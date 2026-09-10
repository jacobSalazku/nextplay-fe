'use client';

import { useParams } from 'next/navigation';
import { NotFoundState } from '@/components/feedback/not-found-state';

export default function PlayNotFound() {
  const { routeKey } = useParams<{ routeKey: string }>();

  return (
    <NotFoundState
      kicker="Off the playbook"
      title="Play not found"
      description="This play was moved or deleted, or it isn't on this team."
      homeHref={routeKey ? `/team/${routeKey}/playbook` : '/club'}
      homeLabel="Back to the playbook"
    />
  );
}
