import { CalendarClock } from 'lucide-react';
import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export const ScheduleSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-h-full min-h-60 w-full animate-pulse rounded-xl border border-orange-200/30 bg-gray-950 p-3 shadow-2xl md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <SkeletonBox className="h-6 w-40 rounded-md" />
          <div className="flex space-x-2">
            <SkeletonBox className="h-8 w-8 rounded-md" />
            <SkeletonBox className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBox key={index} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="mt-3 flex animate-pulse flex-col rounded-xl border border-orange-200/30 bg-gray-950 p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center text-xl font-semibold text-white">
            <CalendarClock className="mr-2 h-5 text-sm text-gray-400" />
            <SkeletonBox className="h-6 w-48 rounded-md" />
          </h2>
          <SkeletonBox className="h-8 w-32 rounded-md" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBox key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
        <div className="mt-6 flex w-full items-end justify-center gap-4 pt-4">
          <SkeletonBox className="h-12 w-1/2 rounded-lg" />
          <SkeletonBox className="h-12 w-1/2 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
