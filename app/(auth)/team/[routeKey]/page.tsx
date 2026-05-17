import { redirect } from 'next/navigation';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

type TeamRootPageProps = {
  params: Promise<{ routeKey: string }>;
};

async function TeamRootPage({ params }: TeamRootPageProps) {
  const { routeKey } = await params;
  redirect(`/team/${routeKey}/schedule`);
  return null;
}

export default withProtectedPage(TeamRootPage);
