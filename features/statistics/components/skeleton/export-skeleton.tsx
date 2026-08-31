import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export function ExportSkeleton() {
  return (
    <div className="scrollbar-none min-h-full px-3 pt-4 pb-28 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-end">
        <SkeletonBox className="h-7 w-36 rounded-full" />
      </div>

      <div className="rounded-4xl border border-orange-400/25 bg-gray-950/80 p-4 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <SkeletonBox className="h-6 w-32 rounded-full" />
            <SkeletonBox className="h-10 w-72 sm:w-96" />
            <SkeletonBox className="h-4 w-full max-w-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
