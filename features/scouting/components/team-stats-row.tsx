import { analyzeTeamStats } from '../utils/update-stat';
import type { StatlineData } from '../zod/player-stats';
import { TableCell } from '@/components/foundation/table/table-cell';

export const TeamStatsRow = ({
  totalTeamStats,
}: {
  totalTeamStats: StatlineData;
}) => {
  const teamStats = analyzeTeamStats(totalTeamStats);
  return (
    <>
      <TableCell className="p-3 text-left font-medium dark:text-white">
        Team
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.totalPoints}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.fieldGoals.made}/{teamStats.fieldGoals.attempted}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.threePointers.made}/{teamStats.threePointers.attempted}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.freeThrows.made}/{teamStats.freeThrows.attempted}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {(totalTeamStats.defensiveRebounds ?? 0) +
          (totalTeamStats.offensiveRebounds ?? 0)}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.assists ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.steals ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.blocks ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.turnovers ?? 0}
      </TableCell>
      <TableCell className="p-3 text-left font-medium dark:text-white"></TableCell>
    </>
  );
};
