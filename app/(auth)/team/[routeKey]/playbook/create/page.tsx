import { Suspense } from 'react';
import { PlayForm } from '@/features/playbook/components/form/play-form';
import CreatePlaySkeleton from '@/features/playbook/components/skeleton/create-play-skeleton';

export const metadata = {
  title: 'Create Play',
  description: 'Create a new play for your team.',
  openGraph: {
    title: 'Create Play',
    description: 'Create a new play for your team.',
  },
};

async function PlayPage() {
  return (
    <div className="scrollbar-none flex overflow-y-auto">
      <Suspense fallback={<CreatePlaySkeleton />}>
        <PlayForm />
      </Suspense>
    </div>
  );
}

export default PlayPage;
