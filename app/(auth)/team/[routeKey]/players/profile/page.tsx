import { Suspense } from 'react';
import { Metadata } from 'next';
import PlayerDetailPanel from '@/features/team/components/player-detail-panel';
import { PlayerProfileSkeleton } from '@/features/team/components/skeleton/player-profile-skeleton';
import { getUserProfile } from '@/features/team/queries/get-user-profile';
import { playerProfileSearchParamsCache } from '@/utils/search-params';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

type PageProps = {
  searchParams: Promise<{
    id: string;
  }>;
  params: Promise<{ routeKey: string }>;
};

export async function generateMetadata({
  searchParams,
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await playerProfileSearchParamsCache.parse(searchParams);
  const { routeKey } = await params;
  const member = await getUserProfile({ id: id, teamShortId: routeKey });
  const profileName = member.user?.name ?? member.name ?? 'Player';

  return {
    title: `${profileName} Profile | Next Play`,
    description: 'Check your profile and update your information.',
    openGraph: {
      title: `${profileName} Profile | Next Play`,
      description: 'Check your profile and update your information.',
    },
  };
}

async function PlayerProfileContent({
  id,
  routeKey,
}: {
  id: string;
  routeKey: string;
}) {
  const data = await getUserProfile({ id, teamShortId: routeKey });

  return <PlayerDetailPanel userProfile={data} />;
}

const PlayerProfile = async ({ searchParams, params }: PageProps) => {
  const { id } = await playerProfileSearchParamsCache.parse(searchParams);
  const { routeKey } = await params;

  return (
    <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto pb-24 text-white md:pb-8">
      <Suspense fallback={<PlayerProfileSkeleton />}>
        <PlayerProfileContent id={id} routeKey={routeKey} />
      </Suspense>
    </div>
  );
};

export default withProtectedPage(PlayerProfile);
