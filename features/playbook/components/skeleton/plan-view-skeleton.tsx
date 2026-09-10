import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function PlanViewSkeleton() {
  return (
    <div className="scrollbar-none h-screen overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <SkeletonBox className="h-3 w-24 rounded" />
            <SkeletonBox className="h-11 w-72 max-w-full rounded" />
            <SkeletonBox className="h-4 w-40 rounded" />
          </div>
          <div className="flex gap-2">
            <SkeletonBox className="h-9 w-24 rounded-md" />
            <SkeletonBox className="h-9 w-16 rounded-md" />
          </div>
        </div>

        <div className="mt-6 h-px bg-[#2b3a5c]" />

        <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-[auto_1fr]">
          <SkeletonBox className="aspect-[100/94] w-full max-w-[540px] rounded-none" />
          <div className="space-y-3 lg:pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-4 w-full rounded" />
            ))}
            <SkeletonBox className="h-4 w-2/3 rounded" />
          </div>
        </div>

        <SkeletonBox className="mt-16 h-5 w-40 rounded" />
        <div className="mt-6 h-px bg-[#2b3a5c]" />

        <div className="mt-6 grid grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="aspect-[100/94] w-full rounded-none"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
