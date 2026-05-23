'use client';

import { Suspense } from 'react';
import type { PlayerStatRow } from '../../utils/types';
import { StatisticsCard } from '../stats-card';
import { RotateCcw, Shield, Target, Users } from 'lucide-react';
import PlayerDetailSkeleton from './player-detail-skeleton';
import { PlayerPerformanceChart } from './player-performance-chart';

type PlayerDetailViewProps = {
  player: PlayerStatRow;
};

export function PlayerDetailStatistics({ player }: PlayerDetailViewProps) {
  return (
    <div className="flex max-h-screen w-full flex-col pb-20">
      <div className="scrollbar-none flex-1 overflow-y-auto">
        <div className="relative mx-auto mb-16 space-y-6 overflow-hidden rounded-2xl border border-orange-500/20 px-4 py-6 lg:mb-0">
          <div className="pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/70 to-transparent" />
          <Suspense fallback={<PlayerDetailSkeleton />}>
            <div className="relative space-y-4 overflow-visible py-9 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-gray-950/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-orange-200 uppercase">
                <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.9)]" />
                Player Breakdown
              </div>
              <h1 className="font-righteous bg-linear-to-r from-orange-400 via-orange-300 to-orange-200 bg-clip-text text-6xl leading-tight font-bold text-transparent">
                {player.name}
              </h1>
              <p className="pt-2 text-xl font-light text-gray-300">
                Individual Performance Analysis
              </p>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-orange-500 to-orange-300"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatisticsCard
                title="Season PPG"
                value={player.points}
                subtitle="Points per game"
                icon={Target}
              />
              <StatisticsCard
                title="Season APG"
                value={player.assists}
                subtitle="Assists per game"
                icon={Users}
              />
              <StatisticsCard
                title="Season RPG"
                value={(
                  player.defensiveRebounds + player.offensiveRebounds
                ).toFixed(1)}
                subtitle="Rebounds per game"
                icon={RotateCcw}
              />
              <StatisticsCard
                title="Season BPG"
                value={player.blocks}
                subtitle="Blocks per game"
                icon={Shield}
              />
              <StatisticsCard
                title="Season SPG"
                value={player.steals}
                subtitle="Steals per game"
                icon={Shield}
              />
            </div>
          </Suspense>
          <PlayerPerformanceChart player={player} title="Performance Trends" />
        </div>
      </div>
    </div>
  );
}
