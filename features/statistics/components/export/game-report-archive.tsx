import type { ExportGameReport } from '../../utils/types';
import { Ticket } from 'lucide-react';
import { GameReportRow } from './game-report-row';

type GameReportArchiveProps = {
  games: ExportGameReport[];
  latestGame?: ExportGameReport;
  routeKey: string;
  teamName: string;
  totalReports: number;
};

export function GameReportArchive({
  games,
  latestGame,
  routeKey,
  teamName,
  totalReports,
}: GameReportArchiveProps) {
  return (
    <section className="relative mt-5 mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gray-950/70 p-4 sm:p-5">
      <div className="absolute top-16 bottom-8 left-8 hidden w-px bg-linear-to-b from-orange-300/0 via-orange-300/20 to-orange-300/0 md:block" />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-white sm:text-xl">
            <Ticket className="h-5 w-5 text-orange-300" />
            More Game Reports
          </h2>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            Older completed games follow below, newest to oldest.
          </p>
        </div>
      </div>

      {games.length ? (
        <div className="relative grid gap-2 sm:gap-3">
          {games.map((game, index) => {
            const reportIndex = index + 1;
            const isWin = game.teamTotals.points > game.opponentStats.points;

            return (
              <GameReportRow
                game={game}
                isWin={isWin}
                key={game.activityId}
                reportIndex={reportIndex}
                routeKey={routeKey}
                teamName={teamName}
                totalReports={totalReports}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 px-5 py-10 text-center">
          <p className="text-base font-bold text-white sm:text-lg">
            {latestGame ? 'No older reports yet' : 'No game reports yet'}
          </p>
          <p className="mt-2 text-xs text-gray-400 sm:text-sm">
            {latestGame
              ? 'The latest played game is shown above.'
              : 'Save a box score after a game and it will become exportable here.'}
          </p>
        </div>
      )}
    </section>
  );
}
