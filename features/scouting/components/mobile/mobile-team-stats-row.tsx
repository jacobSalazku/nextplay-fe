import { type FC } from 'react';
import { analyzeTeamStats } from '../../utils/update-stat';
import type { StatlineData } from '../../zod/player-stats';

type MobileStatsRowProps = {
  totalTeamStats: StatlineData;
};

const MobileTeamStatsRow: FC<MobileStatsRowProps> = ({ totalTeamStats }) => {
  const teamStats = analyzeTeamStats(totalTeamStats);

  return (
    <div className="mt-6 space-y-2 rounded-xl bg-gray-900 px-2 py-2 text-white shadow-inner">
      <div className="mb-4 flex w-full flex-row items-center justify-between space-y-2 px-2">
        <h3 className="mb-4 text-xl font-semibold text-orange-300">
          Team Stats
        </h3>
        <h3 className="mb-4 text-sm font-semibold">
          Total Points : {teamStats.totalPoints}
        </h3>
      </div>

      <div className="mb-2 grid grid-cols-8 gap-3 text-center text-xs font-semibold text-gray-400 sm:grid-cols-6 md:grid-cols-8">
        <div>FG</div>
        <div>3PT</div>
        <div>FT</div>
        <div>AST</div>
        <div>REB</div>
        <div>STL</div>
        <div>BLK</div>
        <div>TO</div>
      </div>
      <div className="grid grid-cols-8 gap-3 text-center text-sm font-bold sm:grid-cols-6 md:grid-cols-8">
        <div>
          {Number.isFinite(Number(teamStats.fieldGoals?.percentage))
            ? Number(teamStats.fieldGoals.percentage)
            : 0}
          %
        </div>
        <div>
          {Number.isFinite(Number(teamStats.threePointers?.percentage))
            ? Number(teamStats.threePointers.percentage)
            : 0}
          %
        </div>
        <div>
          {Number.isFinite(Number(teamStats.freeThrows?.percentage))
            ? Number(teamStats.freeThrows.percentage)
            : 0}
          %
        </div>

        <div>{totalTeamStats.assists ?? 0}</div>
        <div>
          {totalTeamStats.offensiveRebounds + totalTeamStats.defensiveRebounds}
        </div>
        <div>{totalTeamStats.steals ?? 0}</div>
        <div>{totalTeamStats.blocks ?? 0}</div>
        <div>{totalTeamStats.turnovers ?? 0}</div>
      </div>
    </div>
  );
};

export default MobileTeamStatsRow;
