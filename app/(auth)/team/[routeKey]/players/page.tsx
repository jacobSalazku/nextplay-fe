import { Metadata } from 'next';
import { PlayerBlock } from '@/features/team';
import { getPendingMembers } from '@/features/team/actions/get-pending-members';
import { getTeamInforamtion } from '@/features/team/actions/get-team-infomation';
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
  const pendingMembers = await getPendingMembers(routeKey);

  return (
    <div className="flex min-h-screen flex-col items-center overflow-auto text-white w-full">
      <PlayerBlock team={team} pendingMembers={pendingMembers} />
    </div>
  );
}
export default withProtectedPage(PlayerPage);
