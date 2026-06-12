'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { useTeam } from '@/context/team-context';
import { cn } from '@/utils/tw-merge';
import { BarChart3, FileDown, TrendingUp } from 'lucide-react';
import type {
  GetStatlineAveragesQuery,
  GetTeamStatsQuery,
  TeamInformation,
} from '@/graphql/graphql';
import { Link } from '@/components/foundation/button/link';
import { Tabs, TabsList } from '@/components/foundation/tabs/tab-list';
import { TabsContent } from '@/components/foundation/tabs/tabs-content';
import { TabsTrigger } from '@/components/foundation/tabs/tabs-trigger';
import { PlayerAveragesStatsCard } from './components/player-average-stats-card';
import { PerformanceComparisonChart } from './components/player-performance-comparison-chart';
import TeamPerformanceChart from './components/team/team-performance-chart';
import TeamStatsOverView from './components/team/team-stats-overview';
import type { PlayerStatRow } from './utils/types';

type TabType = 'team' | 'players';

type Statlines = GetStatlineAveragesQuery['getStatlineAverages'];
type TeamStats = GetTeamStatsQuery['getTeamStats'];

type ChartsBlockProps = {
  teamStatlist: TeamStats;
  statsList: Statlines;
  team: TeamInformation;
};

const StatisticsBlock: React.FC<ChartsBlockProps> = memo(
  function StatisticsBlock({ statsList, team, teamStatlist }) {
    const { routeKey } = useTeam();
    const [activeTab, setActiveTab] = useState<TabType>('team');

    const handleTabChange = useCallback(
      (value: string) => {
        setActiveTab(value as TabType);
      },
      [setActiveTab],
    );

    const data: PlayerStatRow[] = useMemo(() => {
      return statsList.map((player) => ({
        name: player.name ?? '',
        memberId: player.memberId,
        gamesPlayed: player.gamesPlayed ?? 0,
        fieldGoalPercentage: player.averages.fieldGoalPercentage ?? 0,
        threePointPercentage: player.averages.threePointPercentage ?? 0,
        freeThrowPercentage: player.averages.freeThrowPercentage ?? 0,
        points: player.averages.pointsPerGame ?? 0,
        assists: player.averages.assists ?? 0,
        defensiveRebounds: player.averages.defensiveRebound ?? 0,
        offensiveRebounds: player.averages.offensiveRebound ?? 0,
        blocks: player.averages.blocks ?? 0,
        steals: player.averages.steals ?? 0,
        turnovers: player.averages.turnovers ?? 0,
      }));
    }, [statsList]);

    const date = new Date();
    const season = date.getFullYear() - 1 + '-' + date.getFullYear();

    return (
      <div className="relative w-full flex-col justify-center gap-8 space-y-4 overflow-hidden rounded-2xl border border-orange-500/10 bg-linear-to-b from-orange-950/15 via-gray-950 to-gray-950 px-3 py-4 md:flex md:space-y-0 md:space-x-4 lg:px-8">
        <div className="relative flex flex-col gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="space-y-3">
            <h1 className="font-righteous bg-linear-to-r from-orange-400 py-4 text-5xl leading-tight font-bold text-transparent via-orange-300 to-orange-200 bg-clip-text sm:text-6xl md:pt-8">
              {team.name}
            </h1>
            <p className="text-xl font-light tracking-wide text-gray-300">
              {season} Season Statistics
            </p>
            <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-orange-500 to-orange-300 lg:mx-0"></div>
          </div>
          <Link
            aria-label="Open Statistics Export Center"
            href={`/team/${routeKey}/statistics/export`}
            variant="outline"
            className="mx-auto rounded-2xl border-orange-300/25 bg-gray-900/70 px-5 py-5 text-sm lg:mx-0"
          >
            <FileDown className="h-4 w-4 text-orange-300" />
            Export Reports
          </Link>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex w-full gap-12"
        >
          <TabsList className="flex w-full gap-4 pt-8 lg:pt-16">
            <TabsTrigger
              id="team-tab"
              value="team"
              className={cn(
                'group flex w-1/2 flex-1 items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 px-6 py-3 text-left transition-colors duration-500 ease-in-out',
                'data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400',
              )}
            >
              <TrendingUp className="hidden h-12 w-12 rounded-lg bg-gray-300/20 p-2 sm:block" />
              <div className="flex flex-col transition-colors duration-300 ease-in-out">
                <p className="text-base font-semibold">Team Stats</p>
                <span className="text-sm text-gray-100/80">
                  Overall Performance
                </span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              id="players-tab"
              value="players"
              className={cn(
                'group flex w-1/2 flex-1 items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 px-6 py-3 text-left transition-colors duration-500 ease-in-out',
                'data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400',
              )}
            >
              <BarChart3 className="hidden h-12 w-12 rounded-lg bg-gray-300/20 p-2 sm:block" />
              <div className="flex flex-col transition-colors duration-300 ease-in-out">
                <p className="text-base font-semibold">Player Stats</p>
                <span className="text-sm text-gray-100/80">
                  Individual Breakdown
                </span>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="team" className="space-y-4 py-4">
            <TeamStatsOverView teamStatlist={teamStatlist} />
            <TeamPerformanceChart
              teamStatlist={teamStatlist}
              title="Monthly Performance Trends"
            />
          </TabsContent>
          <TabsContent value="players" className="space-y-4 py-4">
            <PerformanceComparisonChart statsList={statsList} />
            <PlayerAveragesStatsCard statsList={data} />
          </TabsContent>
        </Tabs>
      </div>
    );
  },
);

export default StatisticsBlock;
