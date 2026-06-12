import { ArrowUpRight, FileDown, Shield } from 'lucide-react';
import { Link } from '@/components/foundation/button/link';

type SeasonReportCardProps = {
  routeKey: string;
};

export function SeasonReportCard({ routeKey }: SeasonReportCardProps) {
  return (
    <article className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/3 p-4 sm:rounded-4xl sm:p-5">
      <FileDown className="absolute top-6 right-6 h-5 w-5 rotate-12 text-orange-200/40" />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-200">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-orange-200 uppercase sm:text-xs">
              Season Report
            </p>
            <h2 className="mt-2 text-lg font-black text-white sm:text-xl">
              Full Statistics PDF
            </h2>
            <p className="mt-2 text-xs leading-5 text-gray-300 sm:text-sm sm:leading-6">
              Team overview, player averages and every played game box score
              bundled together.
            </p>
          </div>
        </div>
        <Link
          href={`/team/${routeKey}/statistics/pdf`}
          target="_blank"
          rel="noreferrer"
          variant="outline"
          className="w-full rounded-2xl border-orange-300/25 bg-gray-950/60 py-5"
          aria-label="Open season PDF"
        >
          <span className="hidden sm:inline">Open season report</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
