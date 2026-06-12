import { formatReportDate, reportNumber } from '../../utils/export-utils';
import type { ExportGameReport } from '../../utils/types';
import { CalendarDays, Download } from 'lucide-react';
import { Link } from '@/components/foundation/button/link';

type LastGameFeatureCardProps = {
  game: ExportGameReport;
  routeKey: string;
  teamName: string;
  totalReports: number;
};

export function LastGameFeatureCard({
  game,
  routeKey,
  teamName,
  totalReports,
}: LastGameFeatureCardProps) {
  return (
    <article className="relative hidden overflow-hidden rounded-4xl border border-orange-300/25 bg-linear-to-br from-orange-500/10 via-gray-900 to-gray-950 p-3 sm:block sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-500 via-orange-200 to-transparent" />
      <div className="absolute -right-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border border-orange-300/15" />

      <div className="relative grid gap-4 lg:grid-cols-[1fr_300px_1fr] lg:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-3 py-1 text-[10px] font-black tracking-[0.24em] text-orange-200 uppercase">
              Last Game
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
              <CalendarDays className="h-3.5 w-3.5 text-orange-300" />
              {formatReportDate(game.date)}
            </span>
          </div>
          <h2 className="truncate text-xl font-black text-white sm:text-2xl">
            {teamName}
          </h2>
          <p className="mt-1 truncate text-sm text-gray-400">
            Featured latest game report
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center rounded-[1.7rem] border border-white/10 bg-gray-950/90 px-4 py-5 shadow-inner shadow-black/50 sm:py-7">
          <div className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gray-950" />
          <div className="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gray-950" />
          <div className="absolute inset-x-6 top-3 h-px bg-linear-to-r from-transparent via-orange-300/30 to-transparent" />
          <div className="text-center">
            <p className="mb-1 text-[10px] font-black tracking-[0.28em] text-orange-200 uppercase">
              Last Game
            </p>
            <p className="font-righteous text-5xl leading-none text-white sm:text-7xl">
              <span className="text-orange-300">{game.teamTotals.points}</span>
              <span className="mx-3 text-gray-600">-</span>
              {game.opponentStats.points}
            </p>
            <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
              Final Score
            </p>
          </div>
        </div>

        <div className="min-w-0 text-left lg:text-right">
          <p className="mb-3 text-[10px] font-black tracking-[0.24em] text-gray-500 uppercase">
            Opponent
          </p>
          <h2 className="truncate text-xl font-black text-white sm:text-2xl">
            {game.opponentName}
          </h2>
          <p className="mt-1 truncate text-sm text-gray-400">{game.title}</p>
        </div>
      </div>

      <div className="relative mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="font-righteous flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-500/10 text-2xl text-orange-300">
            {reportNumber(totalReports, 0)}
          </span>
          <div>
            <p className="text-sm font-bold text-white">Featured report</p>
            <p className="text-xs text-gray-400">
              Newest played game is pinned at the top.
            </p>
          </div>
        </div>
        <Link
          href={`/team/${routeKey}/statistics/pdf/game/${game.activityId}`}
          target="_blank"
          rel="noreferrer"
          variant="primary"
          className="rounded-2xl px-5 py-5"
          aria-label="Export last game PDF"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export last game</span>
        </Link>
      </div>
    </article>
  );
}
