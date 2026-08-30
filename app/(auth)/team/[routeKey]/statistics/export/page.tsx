import { ExportBlock } from '@/features/statistics/components/export';
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

async function StatisticsExportPage({ params }: ExportPageProps) {
  const { routeKey } = await params;
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

export default withProtectedPage(StatisticsExportPage);
