'use client';

import { PlayCardSkeleton } from '@/components/skeleton/playcard-skeleton';
import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function PlaybookLibrarySkeleton() {
  return (
    <div className="min-h-screen max-w-screen bg-black px-8 py-10 text-white">
      <SkeletonBox className="mb-6 h-6 w-40" />
      <SkeletonBox className="mb-10 h-10 w-48" />

      <div className="mb-8 flex gap-4">
        <SkeletonBox className="h-10 w-32" />
        <SkeletonBox className="h-10 w-32" />
        <SkeletonBox className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlayCardSkeleton key={i} />
        ))}

        <div className="flex h-70 w-70 flex-col items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900">
          <SkeletonBox className="mb-4 h-12 w-12 rounded-full" />
          <SkeletonBox className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
