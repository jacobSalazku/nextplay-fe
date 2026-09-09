import { notFound } from 'next/navigation';
import { PlaySheetDocument } from '@/features/pdf/play-sheet-document';
import { sanitizePdfFileName } from '@/features/pdf/utils/file-name';
import { getPlay } from '@/features/playbook/queries/play/get-play';
import { asPlayDiagram } from '@/features/playbook/utils/diagram/parse';
import { renderToStream } from '@react-pdf/renderer';
import { getServerSession } from 'next-auth';
import { authServerOptions } from '@/lib/auth/server-options';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ routeKey: string; id: string }> },
) {
  const { routeKey, id } = await params;

  const play = await getPlay(id, routeKey);
  const diagram = play && asPlayDiagram(play.diagram);
  if (!play || !diagram) notFound();

  const session = await getServerSession(authServerOptions);

  const stream = await renderToStream(
    <PlaySheetDocument
      playName={play.name}
      coachName={session?.user?.name ?? 'Coach'}
      category={play.category}
      diagram={diagram}
      generatedAt={new Date()}
    />,
  );

  return new Response(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${sanitizePdfFileName(
        `${play.name}-coaching-sheet`,
      )}.pdf"`,
    },
  });
}
