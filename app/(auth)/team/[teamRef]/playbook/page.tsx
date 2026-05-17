import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getGameplan } from '@/features/playbook/actions/get-gameplans';
import { getGames } from '@/features/playbook/actions/get-games';
import { getPlays } from '@/features/playbook/actions/get-plays';
import { getPracticePreparations } from '@/features/playbook/actions/get-practice-preparations';
import { getPractices } from '@/features/playbook/actions/get-practices';
import PlaybookBookBlock from '@/features/playbook/components/playbook';
import PlaybookLibrarySkeleton from '@/features/playbook/components/skeleton/playbook-library-skeleton';
import GamePlanForm from '@/features/playbook/form/gameplan-form';
import PracticePreparationForm from '@/features/playbook/form/practice-preparation-form';
import { withProtectedPage } from '@/lib/auth/with-page-guards';
import { getUser } from '@/api/user/get-user';

type PageProps = {
  params: Promise<{ teamRef: string }>;
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

async function PlaybookPage({ params }: PageProps) {
  const { teamRef } = await params;
  const [
    playbook,
    games,
    gameplan,
    practices,
    practicePreparation,
    currentUser,
  ] = await Promise.all([
    getPlays(teamRef),
    getGames(teamRef),
    getGameplan(teamRef),
    getPractices(teamRef),
    getPracticePreparations(teamRef),
    getUser(teamRef),
  ]);

  const role = currentUser.member?.role ?? 'PLAYER';

  return (
    <Suspense fallback={<PlaybookLibrarySkeleton />}>
      <div className="scrollbar-none min-h-screen w-full overflow-x-hidden text-white">
        <div className="mx-auto w-full max-w-screen-2xl pb-12">
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
          />
          <PracticePreparationForm
            mode="create"
            role={role}
            practices={practices}
            playbook={playbook}
          />
        </div>
      </div>
    </Suspense>
  );
}

export default withProtectedPage(PlaybookPage);
