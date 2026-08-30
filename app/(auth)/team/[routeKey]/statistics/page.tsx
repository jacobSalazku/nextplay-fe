import { Suspense } from 'react';
import StatisticsBlock from '@/features/statistics';
import StatisticsSkeleton from '@/features/statistics/components/skeleton-statistics';
import {
  getStatlineAverage,
  getTeamStats,
} from '@/features/statistics/queries';
import { getTeamInforamtion } from '@/features/team/queries/get-team-infomation';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

type PageProps = {
  params: Promise<{ routeKey: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { routeKey } = await params;
  const team = await getTeamInforamtion(routeKey);
  const statsList = await getStatlineAverage({ routeKey });
  const stats = await getTeamStats({ routeKey });

  if (!team) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-white">no team is Found</div>
      </div>
    );
  }
  return (
    <div className="scrollbar-none overflow-y-auto">
      <Suspense fallback={<StatisticsSkeleton />}>
        <StatisticsBlock
          teamStatlist={stats}
          statsList={statsList}
          team={team}
        />
      </Suspense>
    </div>
  );
}
export default withProtectedPage(StatisticsPage);
