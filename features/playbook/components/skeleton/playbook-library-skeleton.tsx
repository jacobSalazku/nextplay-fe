'use client';

import { PlayCardSkeleton } from '@/components/skeleton/playcard-skeleton';
import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function PlaybookLibrarySkeleton() {
  return (
    <div className="scrollbar-none h-full w-full overflow-y-auto overflow-x-hidden text-white">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="flex w-full flex-col gap-8 px-2 pt-2 pb-8 md:px-6 md:pb-10">
          <div className="px-2 md:px-0">
            <SkeletonBox className="h-9 w-64 bg-slate-700/80" />
            <SkeletonBox className="mt-2 h-4 w-80 max-w-full bg-slate-700/70" />
          </div>

          <div className="px-2 md:px-0">
            <div className="flex h-auto w-full justify-between gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-1.5 sm:gap-3 lg:w-2/3">
              <SkeletonBox className="h-11 flex-1 rounded-xl bg-slate-700/80" />
              <SkeletonBox className="h-11 flex-1 rounded-xl bg-slate-700/80" />
              <SkeletonBox className="h-11 flex-1 rounded-xl bg-slate-700/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-2 md:px-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <PlayCardSkeleton key={i} />
            ))}

            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 py-10">
              <SkeletonBox className="h-16 w-16 rounded-xl bg-slate-700/80" />
              <SkeletonBox className="h-5 w-32 bg-slate-700/75" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
