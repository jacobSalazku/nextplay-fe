import { Suspense } from 'react';
import type { Metadata } from 'next';
import GamePlanForm from '@/features/playbook/components/form/gameplan-form';
import PracticePreparationForm from '@/features/playbook/components/form/practice-preparation-form';
import PlaybookBookBlock from '@/features/playbook/components/playbook';
import PlaybookLibrarySkeleton from '@/features/playbook/components/skeleton/playbook-library-skeleton';
import { getGameplan } from '@/features/playbook/queries/gameplan/get-gameplans';
import { getGames } from '@/features/playbook/queries/gameplan/get-games';
import { getPlays } from '@/features/playbook/queries/play/get-plays';
import { getPracticePreparations } from '@/features/playbook/queries/practice/get-practice-preparations';
import { getPractices } from '@/features/playbook/queries/practice/get-practices';
import { withProtectedPage } from '@/lib/auth/with-page-guards';
import { getUser } from '@/api/user/get-user';

type PageProps = {
  params: Promise<{ routeKey: string }>;
};

export const metadata: Metadata = {
  title: 'Playbook Library',
  description:
    "Manage your team's playbook, game plans, and practice preparations.",
  openGraph: {
    title: 'Playbook Library',
    description:
      "Manage your team's playbook, game plans, and practice preparations.",
  },
};

async function PlaybookContent({ routeKey }: { routeKey: string }) {
  const [
    playbook,
    games,
    gameplan,
    practices,
    practicePreparation,
    currentUser,
  ] = await Promise.all([
    getPlays(routeKey),
    getGames(routeKey),
    getGameplan(routeKey),
    getPractices(routeKey),
    getPracticePreparations(routeKey),
    getUser(routeKey),
  ]);

  const role = currentUser.member?.role ?? 'PLAYER';

  return (
    <div className="scrollbar-none h-full w-full overflow-y-auto overflow-x-hidden text-white">
      <div className="mx-auto w-full max-w-screen-4xl">
        <PlaybookBookBlock
          practicePreparation={practicePreparation}
          role={role}
          playbook={playbook}
          gamePlan={gameplan}
        />
        <GamePlanForm
          mode="create"
          role={role}
          data={games}
          playbook={playbook}
          existingGameplanActivityIds={gameplan.map((plan) => plan.activityId)}
        />
        <PracticePreparationForm
          mode="create"
          role={role}
          practices={practices}
          playbook={playbook}
          existingPreparationActivityIds={practicePreparation
            .map((preparation) => preparation.activityId)
            .filter((id): id is string => Boolean(id))}
        />
      </div>
    </div>
  );
}

async function PlaybookPage({ params }: PageProps) {
  const { routeKey } = await params;

  return (
    <Suspense fallback={<PlaybookLibrarySkeleton />}>
      <PlaybookContent routeKey={routeKey} />
    </Suspense>
  );
}

export default withProtectedPage(PlaybookPage);
