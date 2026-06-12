import { reportNumber } from '../../utils/export-utils';
import type { ExportGameReport } from '../../utils/types';
import { Download } from 'lucide-react';
import { Link } from '@/components/foundation/button/link';

type LastGameMobileRowProps = {
  game: ExportGameReport;
  routeKey: string;
  totalReports: number;
};

export function LastGameMobileRow({
  game,
  routeKey,
  totalReports,
}: LastGameMobileRowProps) {
  return (
    <article className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-orange-300/25 bg-white/[0.035] px-3 py-2 sm:hidden">
      <span className="font-righteous flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-500/10 text-lg text-orange-300">
        {reportNumber(totalReports, 0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-white">
          {game.opponentName}
        </p>
        <p className="text-[9px] font-bold tracking-[0.18em] text-orange-200 uppercase">
          Last game
        </p>
      </div>
      <p className="shrink-0 text-base font-bold text-white">
        <span className="text-orange-300">{game.teamTotals.points}</span>
        <span className="mx-1 text-gray-600">-</span>
        {game.opponentStats.points}
      </p>
      <Link
        href={`/team/${routeKey}/statistics/pdf/game/${game.activityId}`}
        target="_blank"
        rel="noreferrer"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl border-orange-300/25 bg-gray-950/60 p-0"
        aria-label="Export last game PDF"
      >
        <Download className="h-4 w-4 text-orange-300" />
      </Link>
    </article>
  );
}
