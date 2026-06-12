'use client';

import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function StatisticsSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.14),_transparent_45%)] px-6 py-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBox className="h-8 w-40" />
        <SkeletonBox className="h-6 w-32 rounded-full" />
      </div>
      <div className="mb-10 text-center">
        <SkeletonBox className="mx-auto h-10 w-40" />
        <SkeletonBox className="mx-auto mt-4 h-6 w-60" />
      </div>

      <div className="mb-8 flex justify-center gap-4">
        <SkeletonBox className="h-12 w-48 rounded-lg" />
        <SkeletonBox className="h-12 w-48 rounded-lg" />
      </div>

      <div className="mb-4 flex justify-end">
        <SkeletonBox className="h-8 w-48 rounded-md" />
      </div>

      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>

      <SkeletonBox className="mb-4 h-6 w-60" />
      <SkeletonBox className="h-64 w-full rounded-lg" />

      <div className="mt-6 flex justify-center gap-4">
        <SkeletonBox className="h-10 w-24 rounded-md" />
        <SkeletonBox className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}
