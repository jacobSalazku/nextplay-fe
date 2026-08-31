import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export function PlayerProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SkeletonBox className="h-28 w-28 rounded-3xl sm:h-32 sm:w-32" />
          <div className="flex flex-col gap-3">
            <SkeletonBox className="h-8 w-48" />
            <SkeletonBox className="h-4 w-32" />
            <div className="flex gap-2">
              <SkeletonBox className="h-6 w-20 rounded-full" />
              <SkeletonBox className="h-6 w-16 rounded-full" />
              <SkeletonBox className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <SkeletonBox className="h-9 w-28 rounded-lg" />
          <SkeletonBox className="h-9 w-28 rounded-lg" />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBox key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
