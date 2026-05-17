import { redirect } from 'next/navigation';
import { getTeam } from './actions/get-team';
import { ActivityList } from './components/activity/activity-list';
import { HorizontalCalender } from './components/calender/horizontal-calender';

const ScheduleBlock = async ({ routeKey }: { routeKey: string }) => {
  const { getTeamActivities } = await getTeam(routeKey);

  const team = getTeamActivities;
  const activities = getTeamActivities.activities;

  if (!team) {
    redirect('/create-team');
  }

  return (
    <div className="font-roboto flex h-full w-full items-start justify-center overflow-y-auto bg-transparent px-2 py-3">
      <div className="h-full w-full">
        <HorizontalCalender activities={activities} team={team} />
        <ActivityList activities={activities} team={team} />
      </div>
    </div>
  );
};

export { ScheduleBlock };
