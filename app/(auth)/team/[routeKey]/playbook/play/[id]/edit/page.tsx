import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlayEditor } from '@/features/playbook/components/editor/play-editor';
import PlayEditorSkeleton from '@/features/playbook/components/skeleton/play-editor-skeleton';
import { getPlay } from '@/features/playbook/queries/play/get-play';
import { asPlayDiagram } from '@/features/playbook/utils/diagram/parse';

type PageProps = {
  params: Promise<{ routeKey: string; id: string }>;
};

export const metadata = {
  title: 'Edit Play',
  description: 'Edit a play diagram.',
};

async function EditorContent({
  id,
  routeKey,
}: {
  id: string;
  routeKey: string;
}) {
  const play = await getPlay(id, routeKey);
  if (!play) notFound();

  const diagram = asPlayDiagram(play.diagram);
  if (!diagram) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
        <h1 className="text-xl font-semibold">This play has no diagram</h1>
        <Link
          href={`/team/${routeKey}/playbook`}
          className="text-sm text-orange-300 underline"
        >
          Back to playbook
        </Link>
      </div>
    );
  }

  return (
    <PlayEditor
      key={play.id}
      playId={play.id}
      routeKey={routeKey}
      name={play.name}
      diagram={diagram}
    />
  );
}

export default async function EditPlayPage({ params }: PageProps) {
  const { routeKey, id } = await params;

  return (
    <Suspense fallback={<PlayEditorSkeleton />}>
      <EditorContent id={id} routeKey={routeKey} />
    </Suspense>
  );
}
