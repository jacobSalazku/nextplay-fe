'use client';

import type { FC, MouseEvent } from 'react';
import useStore from '@/store/store';
import { cn } from '@/utils/tw-merge';
import { format, isSameDay } from 'date-fns';
import type { Activity, GetTeamActivitiesQuery } from '@/graphql/graphql';
import { ActivityType } from '@/graphql/graphql';
import { CalendarActivityButton } from './calendar-activity-button';

type CalendarDayProps = {
  day: Date;
  activities: GetTeamActivitiesQuery['getTeamActivities']['activities'];
};

export const CalendarDay: FC<CalendarDayProps> = ({ day, activities }) => {
  const {
    selectedDate,
    setSelectedDate,
    setOpenGameDetails,
    setOpenPracticeDetails,
    setSelectedActivity,
  } = useStore();

  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const isToday = isSameDay(day, new Date());

  const activitiesForDay = activities.filter((activity) =>
    isSameDay(new Date(activity.date), day),
  );

  const displayActivities = activitiesForDay.slice(0, 3);
  const extraActivitiesCount =
    activitiesForDay.length > 3 ? activitiesForDay.length - 3 : null;

  const OpenActivityDetailModal = (
    e: MouseEvent<HTMLButtonElement>,
    activity: Activity,
  ) => {
    // Prevent event bubbling
    e.stopPropagation();
    setSelectedActivity(activity);
    if (activity.type === ActivityType.Game) {
      setOpenGameDetails(true);
    } else {
      setOpenPracticeDetails(true); // Open Practice details modal
    }
  };

  return (
    <div
      onClick={() => setSelectedDate(day)}
      className={cn(
        'group flex max-h-full min-h-40 w-full cursor-pointer flex-col items-end justify-start rounded-md p-1.5 transition-all duration-200 focus:ring-2 focus:ring-orange-200/80 focus:outline-none md:p-2 lg:p-4 xl:h-[13rem]',
        isSelected
          ? 'border border-orange-300/45 bg-orange-500/10 shadow-sm'
          : 'border border-orange-200/20 bg-white/[0.02] hover:bg-orange-200/10',
      )}
    >
      <div className="inline-flex w-full flex-row items-center justify-between px-1">
        <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
          {format(day, 'EEE')}
        </span>
        <span
          className={cn(
            isToday ? 'text-orange-300' : 'text-gray-300',
            'mb-2 text-sm font-light md:text-lg lg:text-2xl',
          )}
        >
          {format(day, 'd')}
        </span>
      </div>
      {displayActivities.map((activity) => (
        <CalendarActivityButton
          key={activity.id}
          activity={activity}
          onClick={OpenActivityDetailModal}
        />
      ))}
      {extraActivitiesCount && (
        <div className="mt-1 text-center text-xs text-gray-400">
          +{extraActivitiesCount} more
        </div>
      )}
    </div>
  );
};
