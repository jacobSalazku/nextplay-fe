import { formatReportDate, reportNumber } from '../../utils/export-utils';
import type { ExportGameReport } from '../../utils/types';
import { CalendarDays, Download, FileText } from 'lucide-react';
import { Link } from '@/components/foundation/button/link';

type GameReportRowProps = {
  game: ExportGameReport;
  isWin: boolean;
  reportIndex: number;
  routeKey: string;
  teamName: string;
  totalReports: number;
};

export function GameReportRow({
  game,
  isWin,
  reportIndex,
  routeKey,
  totalReports,
}: GameReportRowProps) {
  const teamPoints = game.teamTotals.points;
  const opponentPoints = game.opponentStats.points;

  return (
    <article className="group scroll-mb-28 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/80 transition-colors duration-200 hover:border-orange-300/25 hover:bg-gray-950">
      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:grid-cols-[5rem_minmax(0,1fr)_auto]">
        <div className="relative flex items-center justify-center border-r border-white/10 bg-white/[0.04]">
          <div className="absolute inset-y-3 right-0 w-px bg-orange-300/25" />
          <div className="text-center">
            <p className="hidden text-[9px] font-black tracking-[0.22em] text-gray-500 uppercase sm:block">
              Report
            </p>
            <p className="font-righteous mt-0 text-lg leading-none text-orange-300 sm:mt-1 sm:text-3xl">
              {reportNumber(totalReports, reportIndex)}
            </p>
          </div>
        </div>

        <div className="min-w-0 px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-300/15 bg-orange-500/10 text-orange-300 sm:flex">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-xs font-bold text-white sm:text-base sm:font-black md:text-lg">
                <span className="sm:hidden">{game.opponentName}</span>
                <span className="hidden sm:inline">{game.title}</span>
              </h3>
              <p className="hidden text-xs text-gray-500 sm:block">
                Completed game report
              </p>
            </div>
          </div>

          <div className="mt-1 hidden flex-wrap items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300">
              <CalendarDays className="h-3.5 w-3.5 text-orange-300" />
              {formatReportDate(game.date)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-gray-300">
              {isWin ? 'Win' : 'Loss'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-l border-white/10 bg-black/10 px-2 py-2 sm:gap-3 sm:px-3 sm:py-3">
          <div className="grid min-w-20 overflow-hidden rounded-xl border border-white/10 bg-gray-950/80 sm:min-w-32 sm:rounded-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-2 py-1 sm:px-3">
              <span className="hidden text-[9px] font-black tracking-[0.18em] text-gray-500 uppercase sm:block">
                Team
              </span>
              <span className="text-sm font-black text-orange-300 sm:text-lg">
                {teamPoints}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-1 sm:px-3">
              <span className="hidden text-[9px] font-black tracking-[0.18em] text-gray-500 uppercase sm:block">
                Opp
              </span>
              <span className="text-sm font-black text-white sm:text-lg">
                {opponentPoints}
              </span>
            </div>
          </div>

          <Link
            href={`/team/${routeKey}/statistics/pdf/game/${game.activityId}`}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl border-white/10 bg-gray-950/70 p-0 hover:border-orange-300/35 hover:bg-gray-900"
            aria-label={`Export ${game.title} PDF`}
          >
            <Download className="h-4 w-4 text-orange-300" />
            <span className="hidden lg:inline">Export</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
