import { Metadata } from 'next';
import { getUserProfile } from '@/features/team/actions/get-user-profile';
import PlayerDetailPanel from '@/features/team/components/player-detail-panel';
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

const PlayerProfile = async ({ searchParams, params }: PageProps) => {
  const { id } = await playerProfileSearchParamsCache.parse(searchParams);
  const { routeKey } = await params;
  const data = await getUserProfile({ id: id, teamShortId: routeKey });

  return <PlayerDetailPanel userProfile={data} />;
};

export default withProtectedPage(PlayerProfile);
