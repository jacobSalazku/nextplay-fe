'use client';

import { useCallback, type FC } from 'react';
import { useRouter } from 'next/navigation';
import type { CoachDashTab } from '../utils/types';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { cn } from '@/utils/tw-merge';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import {
  DeleteGamePlanDocument,
  DeletePracticePreparationDocument,
  type GamePlan,
  type Play,
  type PracticePreparation,
} from '@/graphql/graphql';
import { Card } from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';
import { Tabs, TabsList } from '@/components/foundation/tabs/tab-list';
import { TabsContent } from '@/components/foundation/tabs/tabs-content';
import { TabsTrigger } from '@/components/foundation/tabs/tabs-trigger';
import { PlanCard } from './play/plan-card';
import { PlayCard } from './play/play-card';

type PageProps = {
  practicePreparation: PracticePreparation[];
  playbook?: Play[];
  gamePlan?: GamePlan[];
  role: string;
};

const PlaybookBookBlock: FC<PageProps> = ({
  practicePreparation,
  playbook,
  gamePlan,
  role,
}) => {
  const { routeKey } = useTeam();
  const router = useRouter();
  const {
    activeCoachTab,
    setOpenGamePlan,
    setOpenPracticePreparation,
    setActiveCoachTab,
  } = useCoachDashboardStore();

  const onDeleteSuccess = () => {
    router.refresh();
    toast.success('Deleted successfully', {
      ...toastStyling,
      position: 'top-right',
    });
  };

  const { mutate: deleteGamePlan } = useMutation({
    mutationFn: (gamePlanId: string) =>
      gqlRequest(DeleteGamePlanDocument, { input: { routeKey, gamePlanId } }),
    onSuccess: onDeleteSuccess,
  });
  const { mutate: deletePracticePreparation } = useMutation({
    mutationFn: (practicePreparationId: string) =>
      gqlRequest(DeletePracticePreparationDocument, {
        input: { routeKey, practicePreparationId },
      }),
    onSuccess: onDeleteSuccess,
  });

  const handleCoachTabChange = useCallback(
    (value: string) => {
      setActiveCoachTab(value as CoachDashTab);
    },
    [setActiveCoachTab],
  );

  const handleDeletePlan = (planId: string, type: 'gameplan' | 'practice') => {
    if (type === 'gameplan') deleteGamePlan(planId);
    else if (type === 'practice') deletePracticePreparation(planId);
  };

  return (
    <div className="flex w-full flex-col gap-8 px-2 pt-2 pb-8 md:px-6 md:pb-10">
      <div className="hidden px-2 md:px-0 md:block ">
        <h1 className="font-righteous text-3xl font-bold text-white sm:text-3xl ">
          Playbook Library
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Manage your plays, game plans, and practice preparations.
        </p>
      </div>
      <Tabs
        value={activeCoachTab}
        onValueChange={handleCoachTabChange}
        className="m-0 pt-6 flex flex-col gap-6 px-2 text-sm md:px-0 md:pt-0"
      >
        <TabsList className="flex h-auto w-full justify-between gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-1.5 sm:gap-3 lg:w-2/3">
          <TabsTrigger
            id="gameplan"
            value="gameplan"
            className={cn(
              'group flex w-1/2 flex-1 items-center gap-4 rounded-xl border border-transparent bg-transparent px-4 py-3 text-left text-white/70 transition-all duration-300',
              'data-[state=active]:border-transparent data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg',
            )}
          >
            <span className="font-semibold">Gameplan</span>
          </TabsTrigger>
          <TabsTrigger
            id="practice"
            value="practice"
            className={cn(
              'group flex w-1/2 flex-1 items-center gap-4 rounded-xl border border-transparent bg-transparent px-4 py-3 text-left text-white/70 transition-all duration-300',
              'data-[state=active]:border-transparent data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg',
            )}
          >
            <span className="font-semibold">Practice</span>
          </TabsTrigger>
          <TabsTrigger
            id="play"
            value="play"
            className={cn(
              'group flex w-1/2 flex-1 items-center gap-4 rounded-xl border border-transparent bg-transparent px-4 py-3 text-left text-white/70 transition-all duration-300',
              'data-[state=active]:border-transparent data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg',
            )}
          >
            <span className="font-semibold">Playbook</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gameplan">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {role === 'COACH' && (
              <Card className="group flex h-80 cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 py-10 text-xs text-white transition-all duration-200 hover:border-orange-300/50 hover:bg-slate-900/80">
                <Button
                  aria-label="Add New GamePlan"
                  onClick={() => setOpenGamePlan(true)}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 px-6 py-6 group-hover:bg-slate-900 md:px-10 md:py-10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <span className="font-righteous text-xl font-bold transition-colors">
                  Add New GamePlan
                </span>
              </Card>
            )}
            {gamePlan?.map((item, idx) => (
              <PlanCard
                key={idx}
                role={role}
                plan={item}
                type="gameplan"
                onDelete={() => handleDeletePlan(item.id, 'gameplan')}
                onView={{
                  pathname: `/team/${routeKey}/playbook/gameplan`,
                  query: { id: item.id },
                }}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="practice">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {role === 'COACH' && (
              <Card className="group flex h-80 cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 py-10 text-xs text-white transition-all duration-200 hover:border-orange-300/50 hover:bg-slate-900/80">
                <Button
                  onClick={() => setOpenPracticePreparation(true)}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 px-6 py-6 group-hover:bg-slate-900 md:px-10 md:py-10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <span className="font-righteous text-xl font-bold transition-colors">
                  Add New Preparation
                </span>
              </Card>
            )}
            {practicePreparation?.map((practice, idx) => (
              <PlanCard
                key={idx}
                role={role}
                plan={practice}
                type="practice"
                onDelete={() => handleDeletePlan(practice.id, 'practice')}
                onView={{
                  pathname: `/team/${routeKey}/playbook/practice-preparation`,
                  query: { id: practice.id },
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="play" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {role === 'COACH' && (
              <Card className="group flex cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 py-24 text-xs text-white transition-all duration-200 hover:border-orange-300/50 hover:bg-slate-900/80">
                <Link
                  aria-label="Add New Play"
                  href={{
                    pathname: `/team/${routeKey}/playbook/create`,
                  }}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 px-6 py-6 group-hover:bg-slate-900 md:px-10 md:py-10"
                >
                  <Plus className="h-6 w-6" />
                </Link>
                <span className="font-righteous text-xl font-bold transition-colors">
                  Add New Play
                </span>
              </Card>
            )}
            {playbook?.map((play, idx) => (
              <PlayCard key={idx} role={role} play={play} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlaybookBookBlock;
