import { NewPlaySetup } from '@/features/playbook/components/editor/new-play-setup';
import { getPlayEditorConfig } from '@/features/playbook/queries/play/get-play-editor-config';

type PageProps = {
  params: Promise<{ routeKey: string }>;
};

export const metadata = {
  title: 'New Play',
  description: 'Start a new play with a court and formation.',
};

export default async function NewPlayPage({ params }: PageProps) {
  const { routeKey } = await params;
  const config = await getPlayEditorConfig();

  return (
    <div className="scrollbar-none flex h-screen overflow-y-auto">
      <NewPlaySetup routeKey={routeKey} formations={config.formations} />
    </div>
  );
}
