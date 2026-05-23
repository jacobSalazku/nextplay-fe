import { memo } from 'react';
import type { PlayerStatRow } from '../utils/types';
import { useTeam } from '@/context/team-context';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Link } from '@/components/foundation/button/link';
import { PlayerAverageDataTable } from './players-data-table';

const PlayerAveragesStatsCard = memo(function PlayerAveragesStatsCard({
  statsList,
}: {
  statsList: PlayerStatRow[];
}) {
  const { routeKey } = useTeam();

  const columns: ColumnDef<PlayerStatRow>[] = [
    {
      accessorKey: 'name',
      header: 'Player',
      cell: ({ row }) => {
        const player = row.original;

        return (
          <Link
            aria-label={`View ${player.name} statistics`}
            href={{
              pathname: `/team/${routeKey}/statistics/player`,
              query: { id: player.memberId },
            }}
            className="cursor-pointer rounded-full border border-transparent px-3 py-1 font-semibold text-orange-100 transition-colors hover:border-orange-400/35 hover:bg-orange-500/10 hover:text-orange-200"
            variant={'outline'}
          >
            {player.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'gamesPlayed',
      header: 'GP',
    },
    {
      accessorKey: 'points',
      header: 'Points',
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: 'fieldGoalPercentage',
      header: 'FG%',
      cell: ({ getValue }) => `${getValue<number>()}%`,
    },
    {
      accessorKey: 'threePointPercentage',
      header: '3PT%',
      cell: ({ getValue }) => `${getValue<number>()}%`,
    },
    {
      accessorKey: 'freeThrowPercentage',
      header: 'FT%',
      cell: ({ getValue }) => `${getValue<number>()}%`,
    },
    {
      accessorKey: 'assists',
      header: 'AST',
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorFn: (row) => row.offensiveRebounds + row.defensiveRebounds,
      header: 'RB',
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: 'blocks',
      header: 'BLK',
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: 'steals',
      header: 'STL',
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: 'turnovers',
      header: 'TO',
      cell: ({ getValue }) => getValue<number>(),
    },
  ];

  return (
    <Card className="relative w-full overflow-hidden border border-orange-500/20 bg-gray-950/95 p-2 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
      <CardHeader className="w-full p-2">
        <CardTitle className="text-white uppercase tracking-[0.12em]">
          Player Statistics
        </CardTitle>
        <CardDescription className="text-gray-300/85">
          Click on a player name to view detailed performance analysis
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        <PlayerAverageDataTable columns={columns} data={statsList} />
      </div>
    </Card>
  );
});

export { PlayerAveragesStatsCard };
