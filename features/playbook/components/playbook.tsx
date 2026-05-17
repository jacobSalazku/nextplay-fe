'use client';

import { useCallback, type FC } from 'react';
import type { CoachDashTab } from '../utils/types';
import { useTeam } from '@/context/team-context';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { cn } from '@/utils/tw-merge';
import { useMutation } from '@apollo/client/react';
import { Plus } from 'lucide-react';
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
  const { teamRef } = useTeam();
  const {
    activeCoachTab,
    setOpenGamePlan,
    setOpenPracticePreparation,
    setActiveCoachTab,
  } = useCoachDashboardStore();

  const [deleteGamePlan] = useMutation(DeleteGamePlanDocument);
  const [deletePracticePreparation] = useMutation(
    DeletePracticePreparationDocument,
  );

  const handleCoachTabChange = useCallback(
    (value: string) => {
      setActiveCoachTab(value as CoachDashTab);
    },
    [setActiveCoachTab],
  );

  const handleDeletePlan = async (
    planId: string,
    type: 'gameplan' | 'practice',
  ) => {
    if (type === 'gameplan') {
      await deleteGamePlan({
        variables: {
          input: {
            teamId: teamRef,
            gamePlanId: planId,
          },
        },
      });
    } else if (type === 'practice') {
      await deletePracticePreparation({
        variables: {
          input: {
            teamId: teamRef,
            gamePlanId: planId,
          },
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 space-y-6 overflow-y-auto p-4 sm:p-6 md:px-9">
      <div className="m-0 flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
        <h1 className="font-righteous text-3xl font-bold text-white sm:text-3xl">
          Plays Library
        </h1>
      </div>
      <Tabs
        value={activeCoachTab}
        onValueChange={handleCoachTabChange}
        className="m-0 flex gap-8 text-sm"
      >
        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row md:w-full">
            <TabsList className="flex w-full justify-between gap-2 px-0 sm:gap-4 md:w-2/3">
              <TabsTrigger
                id="gameplan"
                value={'gameplan'}
                className={cn(
                  'group flex w-1/2 flex-1 items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors duration-500 ease-in-out',
                  'data-[state=active]:border-transparent data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400',
                )}
              >
                <div className="flex flex-col transition-colors duration-300 ease-in-out">
                  <p className="font-semibold">Gameplan</p>
                </div>
              </TabsTrigger>
              <TabsTrigger
                id="practice"
                value="practice"
                className={cn(
                  'group flex w-1/2 flex-1 items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors duration-500 ease-in-out',
                  'data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400',
                )}
              >
                <div className="flex flex-col transition-colors duration-300 ease-in-out">
                  <p className="font-semibold">Practice</p>
                </div>
              </TabsTrigger>
              <TabsTrigger
                id="play"
                value="play"
                className={cn(
                  'group flex w-1/2 flex-1 items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors duration-500 ease-in-out',
                  'data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400',
                )}
              >
                <div className="flex flex-col transition-colors duration-300 ease-in-out">
                  <p className="font-semibold">Playbook</p>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="gameplan">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gamePlan?.map((item, idx) => (
              <PlanCard
                key={idx}
                role={role}
                plan={item}
                type="gameplan"
                onDelete={() => handleDeletePlan(item.id, 'gameplan')}
                onView={{
                  pathname: `/team/${teamRef}/playbook/gameplan`,
                  query: { id: item.id },
                }}
              />
            ))}
            {role === 'COACH' && (
              <Card className="group flex h-80 cursor-pointer flex-col items-center justify-center gap-6 border border-gray-800 py-10 text-xs text-white transition-all duration-200 hover:border-white/50">
                <Button
                  aria-label="Add New GamePlan"
                  onClick={() => setOpenGamePlan(true)}
                  className="flex items-center justify-center rounded-lg border-gray-700 bg-gray-900 px-6 py-6 group-hover:bg-gray-700 md:px-10 md:py-10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <span className="font-righteous text-xl font-bold transition-colors">
                  Add New GamePlan
                </span>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="practice">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {practicePreparation?.map((practice, idx) => (
              <PlanCard
                key={idx}
                role={role}
                plan={practice}
                type="practice"
                onDelete={() => handleDeletePlan(practice.id, 'practice')}
                onView={{
                  pathname: `/team/${teamRef}/playbook/practice-preparation`,
                  query: { id: practice.id },
                }}
              />
            ))}
            {role === 'COACH' && (
              <Card className="group flex h-80 cursor-pointer flex-col items-center justify-center gap-6 border border-gray-800 py-10 text-xs text-white transition-all duration-200 hover:border-white/50">
                <Button
                  onClick={() => setOpenPracticePreparation(true)}
                  className="flex items-center justify-center rounded-lg border-gray-700 bg-gray-900 px-6 py-6 group-hover:bg-gray-700 md:px-10 md:py-10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <span className="font-righteous text-xl font-bold transition-colors">
                  Add New Preparation
                </span>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="play" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {playbook?.map((play, idx) => (
              <PlayCard key={idx} role={role} play={play} />
            ))}
            {role === 'COACH' && (
              <Card className="group flex cursor-pointer flex-col items-center justify-center gap-6 border border-gray-800 py-24 text-xs text-white transition-all duration-200 hover:border-white/50">
                <Link
                  aria-label="Add New Play"
                  href={{
                    pathname: `/team/${teamRef}/playbook/create`,
                  }}
                  className="flex items-center justify-center rounded-lg border-gray-700 bg-gray-900 px-6 py-6 group-hover:bg-gray-700 md:px-10 md:py-10"
                >
                  <Plus className="h-6 w-6" />
                </Link>
                <span className="font-righteous text-xl font-bold transition-colors">
                  Add New Play
                </span>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlaybookBookBlock;
