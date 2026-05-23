import { notFound } from 'next/navigation';
import { getStatlineAverage } from '@/features/statistics/actions';
import { PlayerDetailStatistics } from '@/features/statistics/components/player-detail/player-detail-statistics';
import { PlayerStatRow } from '@/features/statistics/utils/types';
import { boxScoreSearchParamsCache } from '@/utils/search-params';
import { SearchParams } from 'nuqs/server';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ routeKey: string }>;
};

async function PlayerStatisticsDetailPage({ params, searchParams }: PageProps) {
  const { routeKey } = await params;
  const { id } = await boxScoreSearchParamsCache.parse(searchParams);

  const statsList = await getStatlineAverage({ routeKey: routeKey });
  const player = statsList?.find((stat) => stat.memberId === id);

  if (!player) {
    return notFound();
  }

  const mappedPlayer: PlayerStatRow = {
    memberId: player.memberId,
    name: player.name ?? '',
    gamesPlayed: player.gamesPlayed,
    points: player.averages.pointsPerGame,
    fieldGoalPercentage: player.averages.fieldGoalPercentage,
    threePointPercentage: player.averages.threePointPercentage,
    freeThrowPercentage: player.averages.freeThrowPercentage,
    offensiveRebounds: player.averages.offensiveRebound,
    defensiveRebounds: player.averages.defensiveRebound,
    assists: player.averages.assists,
    steals: player.averages.steals,
    blocks: player.averages.blocks,
    turnovers: player.averages.turnovers,
  };

  return <PlayerDetailStatistics player={mappedPlayer} />;
}

export default withProtectedPage(PlayerStatisticsDetailPage);
