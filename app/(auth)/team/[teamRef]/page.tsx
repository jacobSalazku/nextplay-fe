import { redirect } from 'next/navigation';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

type TeamRootPageProps = {
  params: Promise<{ teamRef: string }>;
};

async function TeamRootPage({ params }: TeamRootPageProps) {
  const { teamRef } = await params;
  redirect(`/team/${teamRef}/schedule`);
  return null;
}

export default withProtectedPage(TeamRootPage);
