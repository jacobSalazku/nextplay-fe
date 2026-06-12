'use client';

import { StatisticsCard } from '../stats-card';
import {
  Activity,
  Gauge,
  Hand,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import type { TeamStats } from '@/graphql/graphql';

const TeamStatsOverViewCharts = ({
  teamStatlist,
}: {
  teamStatlist: TeamStats;
}) => {
  const averages = teamStatlist?.averages;
  const advanced = teamStatlist?.advanced;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <>
        <StatisticsCard
          title="Points Per Game"
          value={averages?.pointsPerGame ?? '0'}
          subtitle={`Total Points: ${teamStatlist?.totalPoints ?? 0}`}
          icon={Trophy}
          iconColor="text-orange-200"
        />
        <StatisticsCard
          title="Field Goal Percentage"
          value={`${averages?.fieldGoalPercentage ?? '0'}%`}
          subtitle="Shot conversion"
          icon={Target}
          iconColor="text-orange-300"
        />
        <StatisticsCard
          title="3-Point %"
          value={`${averages?.threePointPercentage ?? '0'} %`}
          subtitle="Perimeter shooting"
          icon={Zap}
          iconColor="text-orange-200"
        />
        <StatisticsCard
          title="Free Throw %"
          value={`${averages?.freeThrowPercentage ?? '0'} %`}
          subtitle="Line efficiency"
          icon={Hand}
          iconColor="text-orange-100"
        />
        <StatisticsCard
          title="Offensive Rating"
          value={advanced?.offensiveRating ?? '0'}
          subtitle="Attack output"
          icon={Activity}
          iconColor="text-orange-200"
        />
        <StatisticsCard
          title="True Shooting %"
          value={`${advanced?.trueShootingPercentage ?? '0'} %`}
          subtitle="Shooting quality"
          icon={Sparkles}
          iconColor="text-orange-200"
        />
        <StatisticsCard
          title="AST/TO Ratio"
          value={advanced?.assistToTurnoverRatio ?? '0'}
          subtitle="Playmaking control"
          icon={Gauge}
          iconColor="text-orange-300"
        />
        <StatisticsCard
          title="Net Rating"
          value={advanced?.netRating ?? '0'}
          subtitle="Scored vs allowed"
          icon={Shield}
          iconColor="text-orange-200"
        />
      </>
    </div>
  );
};

export default TeamStatsOverViewCharts;
