import { SkeletonBox } from './skeleton-box';

export const PlayCardSkeleton = () => (
  <div className="relative h-full overflow-hidden rounded-[28px] border border-white/15 bg-slate-900 shadow-[0_14px_28px_rgba(7,12,25,0.35)]">
    <SkeletonBox className="h-[220px] w-full rounded-none bg-slate-800/80" />

    <div className="absolute top-4 left-4 flex items-center gap-2">
      <SkeletonBox className="h-6 w-20 rounded-full bg-slate-700/80" />
    </div>
    <div className="absolute top-4 right-4">
      <SkeletonBox className="h-9 w-9 rounded-full bg-slate-700/80" />
    </div>

    <div className="space-y-3 border-t border-white/10 px-3 py-4 sm:px-4">
      <SkeletonBox className="h-6 w-4/5 bg-slate-700/80" />
      <SkeletonBox className="h-4 w-2/3 bg-slate-700/75" />
      <SkeletonBox className="h-9 w-full rounded-full bg-slate-700/85" />
    </div>
  </div>
);
