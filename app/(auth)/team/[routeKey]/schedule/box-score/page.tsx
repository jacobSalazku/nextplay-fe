import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getActivity } from '@/features/schedule/actions/get-activity';
import { getActiveAttendedMembers } from '@/features/scouting/actions/get-active-attended-members';
import Skeleton from '@/features/scouting/components/mobile/skeleton';
import { MultiStatlineTracker } from '@/features/scouting/components/multi-statline-tracker';
import { boxScoreSearchParamsCache } from '@/utils/search-params';
import type { SearchParams } from 'nuqs/server';
import { withProtectedPage } from '@/lib/auth/with-page-guards';
import { getUser } from '@/api/user/get-user';

export const metadata: Metadata = {
  title: 'Box Score',
  description: "Box Score inserts your team's game statistics.",
  openGraph: {
    title: 'Box Score',
    description: "Box Score inserts your team's game statistics.",
  },
};

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ routeKey: string }>;
};

async function TeamBoxScores({ params, searchParams }: PageProps) {
  const { routeKey } = await params;
  const { activityId } = await boxScoreSearchParamsCache.parse(searchParams);

  if (!activityId) {
    redirect(`/team/${routeKey}/schedule`);
  }

  const currentUser = await getUser(routeKey);
  if (currentUser.member.role !== 'COACH') {
    redirect(`/team/${routeKey}/schedule`);
  }

  const [activity, members] = await Promise.all([
    getActivity(routeKey, activityId),
    getActiveAttendedMembers(routeKey, activityId),
  ]);

  if (members.length === 0) {
    return (
      <main className="scrollbar-none flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-900/80 p-8 text-center shadow-xl backdrop-blur">
          <h1 className="mb-2 text-2xl font-semibold">No Players Available</h1>
          <p className="mb-6 text-white/70">
            No players are marked as{' '}
            <span className="font-medium">ATTENDING</span> for this game yet.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`/team/${routeKey}/schedule`}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
            >
              Back To Schedule
            </a>
            <a
              href={`/team/${routeKey}/schedule`}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Set Attendance First
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start overflow-y-auto text-white">
      <div className="flex h-screen max-h-256 w-full max-w-6xl flex-row justify-center py-4">
        <Suspense fallback={<Skeleton />}>
          <MultiStatlineTracker activity={activity} players={members} />
        </Suspense>
      </div>
    </div>
  );
}

export default withProtectedPage(TeamBoxScores);
