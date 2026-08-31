import { Suspense } from 'react';
import { Metadata } from 'next';
import { PlayerBlock } from '@/features/team';
import { PlayersSkeleton } from '@/features/team/components/skeleton/players-skeleton';
import { getTeamInforamtion } from '@/features/team/queries/get-team-infomation';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

export const metadata: Metadata = {
  title: 'Players',
  description: "View and manage your team's players.",
  openGraph: {
    title: 'Players',
    description: "View and manage your team's players.",
  },
};

async function PlayersContent({ routeKey }: { routeKey: string }) {
  const team = await getTeamInforamtion(routeKey);

  return <PlayerBlock team={team} />;
}

async function PlayerPage({
  params,
}: {
  params: Promise<{ routeKey: string }>;
}) {
  const { routeKey } = await params;

  return (
    <div className="h-full w-full overflow-y-auto text-white">
      <Suspense fallback={<PlayersSkeleton />}>
        <PlayersContent routeKey={routeKey} />
      </Suspense>
    </div>
  );
}
export default withProtectedPage(PlayerPage);
