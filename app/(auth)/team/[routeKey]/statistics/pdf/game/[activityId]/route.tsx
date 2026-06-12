import { notFound } from 'next/navigation';
import { GameReportDocument } from '@/features/pdf/game-report-document';
import {
  formatPdfDate,
  sanitizePdfFileName,
} from '@/features/pdf/utils/file-name';
import { getGamesWithBoxScores } from '@/features/statistics/actions';
import { getTeamInforamtion } from '@/features/team/actions/get-team-infomation';
import { renderToStream } from '@react-pdf/renderer';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ routeKey: string; activityId: string }> },
) {
  const { routeKey, activityId } = await params;
  const team = await getTeamInforamtion(routeKey);
  const gamesWithScores = await getGamesWithBoxScores({ routeKey });
  const game = gamesWithScores.find((item) => item.activityId === activityId);
  const generatedAt = new Date();

  if (!game || new Date(game.date).getTime() > generatedAt.getTime()) {
    notFound();
  }

  const stream = await renderToStream(
    <GameReportDocument game={game} generatedAt={generatedAt} team={team} />,
  );

  return new Response(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${sanitizePdfFileName(
        `${team.slug}-game-report-${formatPdfDate(game.date)}-vs-${game.opponentName}`,
      )}.pdf"`,
    },
  });
}
