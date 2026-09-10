import { notFound } from 'next/navigation';
import { PlaySheet } from '@/features/playbook/components/sheet/play-sheet';
import { getPlay } from '@/features/playbook/queries/play/get-play';
import { asPlayDiagram } from '@/features/playbook/utils/diagram/parse';
import { getServerSession } from 'next-auth';
import { authServerOptions } from '@/lib/auth/server-options';

export const metadata = {
  title: 'Coaching sheet',
  description: 'A printable sheet of every phase of a play.',
};

type PageProps = {
  params: Promise<{ routeKey: string; id: string }>;
};

export default async function CoachingSheetPage({ params }: PageProps) {
  const { routeKey, id } = await params;

  const play = await getPlay(id, routeKey);
  const diagram = play && asPlayDiagram(play.diagram);
  if (!play || !diagram) notFound();

  const session = await getServerSession(authServerOptions);

  return (
    <PlaySheet
      playName={play.name}
      coachName={session?.user?.name ?? 'Coach'}
      category={play.category}
      diagram={diagram}
      backHref={`/team/${routeKey}/playbook/play/${id}/edit`}
    />
  );
}
