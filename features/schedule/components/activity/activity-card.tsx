'use client';

import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import { deleteActivity } from '../../actions/mutations';
import { useTeam } from '@/context/team-context';
import { deleteToastStyling } from '@/features/toast-notification/styling';
import useStore from '@/store/store';
import { getActivityStyle } from '@/utils';
import { cn } from '@/utils/tw-merge';
import { isToday } from 'date-fns';
import { Clock, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  Activity,
  ActivityType,
  MemberWithAttendances,
} from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';

type ActivityCardProps = {
  activity: Activity;
  member: MemberWithAttendances;
};

export const ActivityCard: FC<ActivityCardProps> = ({ activity, member }) => {
  const { routeKey } = useTeam();
  const router = useRouter();
  const {
    setOpenPracticeDetails,
    setOpenGameDetails,
    setSelectedActivity,
    setOpenGameAttendance,
    setOpenPracticeAttendance,
  } = useStore();

  const { bgColor, textColor, Icon } = getActivityStyle(activity.type);
  const role = member?.role === 'COACH';

  const handleViewDetails = () => {
    setSelectedActivity(activity);
    if (activity.type === ActivityType.Game) {
      setOpenGameDetails(true);
    } else if (activity.type === ActivityType.Practice) {
      setOpenPracticeDetails(true);
    }
  };

  const handleAttendance = () => {
    setSelectedActivity(activity);
    if (activity.type === ActivityType.Game) {
      setOpenGameAttendance(true);
    } else {
      setOpenPracticeAttendance(true);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const res = await deleteActivity({ id, routeKey });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    router.refresh();
    toast.success('Activity deleted', {
      ...deleteToastStyling,
      position: 'top-center',
    });
  };

  const date = isToday(new Date(activity.date));

  return (
    <div className="group flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-950 p-3 transition-all hover:border-gray-700 hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-4">
      <div className="flex flex-row items-start gap-4 sm:gap-6">
        <div
          className={cn(
            bgColor,
            textColor,
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:h-14 lg:w-14',
          )}
        >
          <Icon className="h-5 w-5 lg:h-7 lg:w-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">
            {activity.title}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            {activity.time} ({activity.duration} hr
            {activity.duration !== 1 ? 's' : ''})
          </div>
        </div>
      </div>
      <div className="flex gap-2 sm:ml-auto sm:flex-row sm:items-center">
        {activity.type === ActivityType.Game && role && date && (
          <Link
            aria-label="Create Box Score"
            href={{
              pathname: `/team/${routeKey}/schedule/box-score`,
              query: { activityId: activity.id },
            }}
            size="sm"
            variant="default"
            className="w-full sm:w-auto"
          >
            Create Box Score
          </Link>
        )}
        {role && !(activity.type === ActivityType.Game && date) && (
          <Button
            aria-label="View Attendance"
            onClick={handleAttendance}
            size="sm"
            variant="default"
            className="w-full sm:w-auto"
          >
            View Attendance
          </Button>
        )}

        {!role && (
          <Button
            aria-label="Attendance"
            onClick={handleAttendance}
            size="sm"
            variant="default"
            className="w-full sm:w-auto"
          >
            Attendance
          </Button>
        )}
        <Button
          aria-label="View Details"
          onClick={handleViewDetails}
          variant="primary"
          size="sm"
          className="w-full sm:w-auto"
        >
          View Details
        </Button>
        {role && (
          <Button
            onClick={async () => handleDeleteActivity(activity.id)}
            aria-label="Delete Activity"
            size="sm"
            variant="danger"
            className="w-full sm:w-auto"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
