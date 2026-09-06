import { Suspense } from 'react';
import { NewPlaySetup } from '@/features/playbook/components/editor/new-play-setup';
import CreatePlaySkeleton from '@/features/playbook/components/skeleton/create-play-skeleton';
import { getPlayEditorConfig } from '@/features/playbook/queries/play/get-play-editor-config';

type PageProps = {
  params: Promise<{ routeKey: string }>;
};

export const metadata = {
  title: 'New Play',
  description: 'Start a new play with a court and formation.',
};

async function SetupContent({ routeKey }: { routeKey: string }) {
  const config = await getPlayEditorConfig();

  return <NewPlaySetup routeKey={routeKey} formations={config.formations} />;
}

export default async function NewPlayPage({ params }: PageProps) {
  const { routeKey } = await params;

  return (
    <div className="scrollbar-none flex h-screen overflow-y-auto">
      <Suspense fallback={<CreatePlaySkeleton />}>
        <SetupContent routeKey={routeKey} />
      </Suspense>
    </div>
  );
}
