import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function PlanViewSkeleton() {
  return (
    <div className="scrollbar-none h-screen overflow-y-auto px-4 pt-10">
      <div className="mx-auto max-w-7xl md:px-4">
        <SkeletonBox className="mb-4 h-8 w-32 rounded-md" />

        <div className="flex flex-col p-0 sm:flex-row sm:items-start md:gap-8">
          <div className="mb-6 w-full flex-1 space-y-3 text-white">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBox key={i} className="h-4 w-full rounded bg-gray-700" />
            ))}
            <SkeletonBox className="h-4 w-3/4 rounded bg-gray-700" />
          </div>

          <div className="mb-4 flex-shrink-0 sm:mr-6 sm:mb-0 sm:w-2/5">
            <SkeletonBox className="h-80 w-full rounded-xl border-2 bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
