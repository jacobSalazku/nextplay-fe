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

async function StatisticsContent({ routeKey }: { routeKey: string }) {
  const [team, statsList, stats] = await Promise.all([
    getTeamInforamtion(routeKey),
    getStatlineAverage({ routeKey }),
    getTeamStats({ routeKey }),
  ]);

  if (!team) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-white">no team is Found</div>
      </div>
    );
  }

  return (
    <StatisticsBlock teamStatlist={stats} statsList={statsList} team={team} />
  );
}

async function StatisticsPage({ params }: PageProps) {
  const { routeKey } = await params;

  return (
    <div className="scrollbar-none overflow-y-auto">
      <Suspense fallback={<StatisticsSkeleton />}>
        <StatisticsContent routeKey={routeKey} />
      </Suspense>
    </div>
  );
}
export default withProtectedPage(StatisticsPage);
