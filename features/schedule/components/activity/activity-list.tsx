'use client';

import { useMemo, useState } from 'react';
import GameForm from '../form/game-form';
import PracticeForm from '../form/practice-form';
import AttendanceModal from '@/features/attendance/components/attendance-modal';
import useStore from '@/store/store';
import { useUserStore } from '@/store/user-store';
import { format, isSameDay } from 'date-fns';
import { AlertCircle, CalendarClock, Plus } from 'lucide-react';
import { GetTeamActivitiesQuery, Team } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { ActivityCard } from './activity-card';
import { ActivityFilter } from './activity-filter';
import CoachAttendanceListModal from './coach-attendance-list-modal';

type ActivityListProps = {
  activities: GetTeamActivitiesQuery['getTeamActivities']['activities'];
  team: Team;
};

export function ActivityList({ activities, team }: ActivityListProps) {
  const {
    selectedDate,
    openGameModal,
    openGameDetails,
    openPracticeModal,
    openPracticeDetails,
    openGameAttendance,
    setOpenGameModal,
    setOpenGameDetails,
    setOpenPracticeModal,
    setOpenPracticeDetails,
    openPracticeAttendance,
  } = useStore();

  const { user } = useUserStore();

  const [filter, setFilter] = useState<'all' | 'game' | 'practice'>('all');

  const role = user?.member?.role === 'COACH';

  const filteredActivities = useMemo(() => {
    const activitiesForDay = (activities ?? []).filter((activity) =>
      isSameDay(new Date(activity.date), selectedDate),
    );

    if (filter === 'all') return activitiesForDay;
    return activitiesForDay.filter(
      (activity) => activity.type.toLowerCase() === filter,
    );
  }, [activities, selectedDate, filter]);

  if (!user?.member) {
    return null;
  }

  return (
    <>
      <div className="animate-fade-in mt-3 flex flex-col rounded-xl border border-orange-200/30 p-3 shadow-sm duration-300 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center text-xl font-semibold text-white">
            <CalendarClock className="mr-2 h-5 text-sm text-gray-400" />
            Activities for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <ActivityFilter
            currentFilter={filter}
            onFilterChange={(newFilter) => setFilter(newFilter)}
          />
        </div>
        {filteredActivities.length > 0 ? (
          <div className="scrollbar-none max-h-430 overflow-y-auto md:max-h-480 md:min-h-96 md:pr-2 xl:max-h-600">
            <div className="flex flex-col gap-1">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  member={user.member}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="scrollbar-none mt-4 flex h-96 flex-col items-center justify-center gap-3 rounded-2xl bg-gray-800 p-4 md:max-h-72 md:p-6 xl:max-h-96">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400 opacity-50" />
            <p className="text-gray-400">
              No activities scheduled for this day
            </p>
            {role && (
              <Button
                aria-label="Add Activity"
                variant="primary"
                size="sm"
                className="mt-4 bg-gray-950 hover:bg-orange-200/10"
                onClick={() => setOpenGameModal(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Activity
              </Button>
            )}
          </div>
        )}

        {role && (
          <div className="mt-auto grid w-full grid-cols-2 gap-3 pt-4">
            <Button
              aria-label="Create Game"
              onClick={() => setOpenGameModal(true)}
              type="button"
              variant="light"
              className="w-full py-5"
            >
              Create Game
            </Button>
            <Button
              aria-label="Create Practice"
              onClick={() => setOpenPracticeModal(true)}
              type="button"
              variant="outline"
              className="w-full py-5"
            >
              Create Practice
            </Button>
          </div>
        )}
      </div>

      {openGameModal && selectedDate && (
        <GameForm
          team={team}
          mode="create"
          member={user.member}
          onClose={() => setOpenGameModal(false)}
        />
      )}
      {openPracticeModal && selectedDate && (
        <PracticeForm
          team={team}
          mode="create"
          member={user.member}
          onClose={() => setOpenPracticeModal(false)}
        />
      )}
      {openGameDetails && (
        <GameForm
          team={team}
          mode="view"
          member={user.member}
          onClose={() => setOpenGameDetails(false)}
        />
      )}
      {openPracticeDetails && (
        <PracticeForm
          team={team}
          mode="view"
          member={user.member}
          onClose={() => setOpenPracticeDetails(false)}
        />
      )}
      {openGameAttendance &&
        (role ? (
          <CoachAttendanceListModal team={team} mode="Game" />
        ) : (
          <AttendanceModal member={user.member} mode="Game" />
        ))}
      {openPracticeAttendance &&
        (role ? (
          <CoachAttendanceListModal team={team} mode="Practice" />
        ) : (
          <AttendanceModal member={user.member} mode="Practice" />
        ))}
    </>
  );
}
