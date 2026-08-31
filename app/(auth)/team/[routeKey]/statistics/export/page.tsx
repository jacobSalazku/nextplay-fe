import { Suspense } from 'react';
import { ExportBlock } from '@/features/statistics/components/export';
import { ExportSkeleton } from '@/features/statistics/components/skeleton/export-skeleton';
import { getGamesWithBoxScores } from '@/features/statistics/queries';
import { getTeamInforamtion } from '@/features/team/queries/get-team-infomation';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

type ExportPageProps = {
  params: Promise<{ routeKey: string }>;
};

async function getExportPageData(routeKey: string) {
  const [team, gamesWithScores] = await Promise.all([
    getTeamInforamtion(routeKey),
    getGamesWithBoxScores({ routeKey }),
  ]);

  const snapshotTime = Date.now();
  const completedGames = gamesWithScores
    .filter((game) => new Date(game.date).getTime() <= snapshotTime)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    team,
    completedGames,
    totalReports: completedGames.length,
    latestGame: completedGames[0],
  };
}

async function ExportContent({ routeKey }: { routeKey: string }) {
  const { completedGames, latestGame, team, totalReports } =
    await getExportPageData(routeKey);

  return (
    <ExportBlock
      completedGames={completedGames}
      latestGame={latestGame}
      routeKey={routeKey}
      team={team}
      totalReports={totalReports}
    />
  );
}

async function StatisticsExportPage({ params }: ExportPageProps) {
  const { routeKey } = await params;

  return (
    <Suspense fallback={<ExportSkeleton />}>
      <ExportContent routeKey={routeKey} />
    </Suspense>
  );
}

export default withProtectedPage(StatisticsExportPage);
