import { PDFDocument } from '@/features/pdf/pdf-document';
import {
  formatPdfDate,
  sanitizePdfFileName,
} from '@/features/pdf/utils/file-name';
import {
  getGamesWithBoxScores,
  getStatlineAverage,
  getTeamStats,
} from '@/features/statistics/queries';
import { getTeamInforamtion } from '@/features/team/queries/get-team-infomation';
import { renderToStream } from '@react-pdf/renderer';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ routeKey: string }> },
) {
  const { routeKey } = await params;
  const team = await getTeamInforamtion(routeKey);
  const stats = await getStatlineAverage({ routeKey });
  const gamesWithScores = await getGamesWithBoxScores({ routeKey });
  const teamStats = await getTeamStats({ routeKey });
  const generatedAt = new Date();
  const completedGamesWithScores = gamesWithScores
    .filter((game) => new Date(game.date).getTime() <= generatedAt.getTime())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const stream = await renderToStream(
    <PDFDocument
      teamName={team.name}
      stats={stats}
      team={team}
      teamStats={teamStats}
      gamesWithScores={completedGamesWithScores}
      generatedAt={generatedAt}
    />,
  );

  return new Response(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${sanitizePdfFileName(
        `${team.slug}-season-report-${formatPdfDate(generatedAt)}`,
      )}.pdf"`,
    },
  });
}
