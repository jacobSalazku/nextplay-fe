import type { MouseEvent } from 'react';
import { getTypeBgColor } from '@/utils/';
import { cn } from '@/utils/tw-merge';
import { Activity, GetTeamActivitiesQuery } from '@/graphql/graphql';

type ActivityButtonProps = {
  activity: NonNullable<GetTeamActivitiesQuery['getTeamActivities']['activities']>[number];
  onClick: (e: MouseEvent<HTMLButtonElement>, activity: Activity) => void;
};

export function CalendarActivityButton({
  activity,
  onClick,
}: ActivityButtonProps) {
  return (
    <button
      type="button"
      key={`${activity.id}-${activity.title}`}
      onClick={(e) => onClick(e, activity)}
      className={cn(
        getTypeBgColor(activity.type),
        'mb-1 inline-flex w-full cursor-pointer items-center justify-between truncate rounded-md border border-black/10 px-1.5 py-1 text-xs font-medium hover:opacity-90 lg:h-full lg:max-h-8',
      )}
    >
      <div className="truncate">{activity.title}</div>
      <div className="text-[10px] opacity-90">{activity.time}</div>
    </button>
  );
}
