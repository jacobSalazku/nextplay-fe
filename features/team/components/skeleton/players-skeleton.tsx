import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export function PlayersSkeleton() {
  return (
    <div className="flex w-full flex-col gap-8 px-2 pt-4 md:px-6 md:pt-2">
      <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 py-5 text-white shadow-xl">
        <div className="flex flex-col gap-5 border-b border-white/10 px-4 py-5 sm:px-8">
          <div className="flex flex-col gap-2">
            <SkeletonBox className="h-8 w-56" />
            <SkeletonBox className="h-4 w-72" />
          </div>
          <SkeletonBox className="h-7 w-28 rounded-full" />

          <div className="rounded-3xl border border-orange-300/20 bg-orange-300/5 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-4 w-80" />
              </div>
              <SkeletonBox className="h-10 w-40 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-6 sm:px-8">
          <SkeletonBox className="h-9 w-full rounded-lg" />
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
