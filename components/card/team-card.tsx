'use client';

import type { FC } from 'react';
import { Link } from '../foundation/button/link';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { GetTeamForDashboardQuery } from '@/graphql/graphql';

type TeamCardProps = {
  team: GetTeamForDashboardQuery['getDashboardTeams'][number];
};

const TeamCard: FC<TeamCardProps> = ({ team }) => {
  console.log(team);
  return (
    <div className="mx-auto w-full max-w-md cursor-pointer rounded-2xl border border-gray-500 p-5 text-blue-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-lg font-semibold">{team.name}</h2>
          <span className="rounded border border-white/20 px-2 py-0.5 text-sm text-white/80">
            {team.ageGroup}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/60">
          {team.members.length} members
        </p>
      </div>
      <div className="space-y-6 py-8 text-sm text-white/90">
        <div className="space-y-3 py-4 text-sm text-white/90">
          {team.activities && team.activities.length > 0 ? (
            <>
              {/* <div className="flex justify-between">
                <span className="font-medium text-white">Next Activity:</span>
                {team.activities[0]?.type === ActivityType.GAME && (
                  <span className="text-white/80">
                    vs {team.activities[0].title}
                  </span>
                )}
                {team.activities[0]?.type === ActivityType.PRACTICE && (
                  <span className="text-white/80">
                    {team.activities[0].title}
                  </span>
                )}
              </div> */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-white/40" />
                  {format(team.activities[0]?.date ?? new Date(), 'dd MMMM')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-white/40" />
                  {team.activities[0]?.time}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-4">
              <div className="space-y-3 py-4 text-sm text-white/90">
                <span className="text-white/60">
                  No activities scheduled yet
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex gap-2 text-sm">
          <span className="rounded bg-white/10 px-2 py-0.5 text-white">5W</span>
          <span className="rounded border border-white/20 px-2 py-0.5 text-white">
            1L
          </span>
        </div>
        <Link
          href={`${team.id.toLowerCase()}/schedule`}
          aria-label={`View ${team.name} details`}
          variant="outline"
        >
          View Team
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
