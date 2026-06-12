import { formatReportDate } from '../../utils/export-utils';
import { ExportBlockProps } from '../../utils/types';
import { FileDown, Trophy } from 'lucide-react';
import { GameReportArchive } from './game-report-archive';
import { LastGameFeatureCard } from './last-game-feature-card';
import { LastGameMobileRow } from './last-game-mobile-row';
import { SeasonReportCard } from './season-report-card';

export function ExportBlock({
  completedGames,
  latestGame,
  routeKey,
  team,
  totalReports,
}: ExportBlockProps) {
  const remainingGames = completedGames.slice(1);

  return (
    <main className="scrollbar-none min-h-full overflow-y-auto scroll-pb-28 px-3 pt-4 pb-28 text-white sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-end">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-orange-200 uppercase sm:text-xs">
          <FileDown className="h-3.5 w-3.5" />
          Export Locker
        </div>
      </div>

      <section className="relative overflow-hidden rounded-4xl border border-orange-400/25 bg-gray-950/80 p-4 shadow-2xl shadow-black/30 sm:p-6">
        <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-orange-300/80 to-transparent" />
        <div className="absolute -top-24 right-6 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full border border-orange-300/10" />
        <div className="absolute left-0 top-16 h-px w-full rotate-[-7deg] bg-orange-200/10" />
        <div className="absolute left-0 top-32 h-px w-full rotate-[-7deg] bg-orange-200/10" />
        <div className="absolute right-12 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent via-orange-300/20 to-transparent lg:block" />

        <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-orange-300/20 bg-orange-500/10 px-3 py-1 text-[10px] font-black tracking-[0.24em] text-orange-200 uppercase sm:mb-4 sm:text-xs">
              <Trophy className="h-3.5 w-3.5" />
              Export Vault
            </div>
            <h1 className="font-righteous text-2xl leading-tight text-white sm:text-4xl lg:text-5xl">
              Reports for {team.name}
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-300 sm:text-sm sm:leading-6">
              Your newest played game sits first. Season and game PDFs use the
              same completed box-score data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gray-400 uppercase sm:text-xs">
                Reports
              </p>
              <p className="mt-2 text-2xl font-black text-orange-300 sm:text-3xl">
                {totalReports}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/3 p-4">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gray-400 uppercase sm:text-xs">
                Latest
              </p>
              <p className="mt-2 truncate text-sm font-bold text-white sm:text-lg">
                {latestGame ? formatReportDate(latestGame.date) : 'No games'}
              </p>
            </div>
          </div>
        </div>

        {latestGame ? (
          <div className="relative grid gap-3 sm:gap-4 xl:grid-cols-[1fr_340px]">
            <LastGameMobileRow
              game={latestGame}
              routeKey={routeKey}
              totalReports={totalReports}
            />
            <LastGameFeatureCard
              game={latestGame}
              routeKey={routeKey}
              teamName={team.name}
              totalReports={totalReports}
            />
            <SeasonReportCard routeKey={routeKey} />
          </div>
        ) : (
          <div className="relative rounded-4xl border border-dashed border-white/15 bg-white/3 px-5 py-12 text-center">
            <p className="text-lg font-black text-white sm:text-xl">
              No exports yet
            </p>
            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              Save a box score after a game and reports will show up here.
            </p>
          </div>
        )}
      </section>

      <GameReportArchive
        games={remainingGames}
        latestGame={latestGame}
        routeKey={routeKey}
        teamName={team.name}
        totalReports={totalReports}
      />
    </main>
  );
}
