import { Metadata } from 'next';
import { PlayerBlock } from '@/features/team';
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

async function PlayerPage({
  params,
}: {
  params: Promise<{ routeKey: string }>;
}) {
  const { routeKey } = await params;
  const team = await getTeamInforamtion(routeKey);

  return (
    <div className="h-full w-full overflow-y-auto text-white">
      <PlayerBlock team={team} />
    </div>
  );
}
export default withProtectedPage(PlayerPage);
