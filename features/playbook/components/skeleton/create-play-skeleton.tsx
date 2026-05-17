import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function CreatePlaySkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-8 bg-black px-6 py-8 text-white">
      <SkeletonBox className="h-4 w-full max-w-7xl" />

      <SkeletonBox className="h-10 w-full max-w-7xl" />
      <SkeletonBox className="h-5 w-full max-w-7xl" />

      <div className="w-full max-w-7xl space-y-6 rounded-xl border border-neutral-700 bg-gray-700 p-6">
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-10 w-full" />
        </div>

        <div className="w-full space-y-2">
          <SkeletonBox className="h-4 w-32" />
          <div className="flex gap-4">
            <SkeletonBox className="h-10 w-24" />
            <SkeletonBox className="h-10 w-24" />
            <SkeletonBox className="h-10 w-24" />
          </div>
        </div>

        <div className="w-full space-y-2">
          <SkeletonBox className="h-4 w-40" />
          <SkeletonBox className="h-10 w-full" />
          <SkeletonBox className="h-40 w-full" />
        </div>
        <SkeletonBox className="h-12 w-full rounded-lg bg-neutral-700" />
      </div>

      <div className="w-full max-w-7xl space-y-4 rounded-xl border border-neutral-700 bg-neutral-900 p-6">
        <div className="flex flex-wrap gap-4">
          <SkeletonBox className="h-8 w-20" />
          <SkeletonBox className="h-8 w-20" />
          <SkeletonBox className="h-8 w-24" />
          <SkeletonBox className="h-8 w-24" />
          <SkeletonBox className="h-8 w-28" />
        </div>

        <div className="mt-4 flex gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-6 animate-pulse rounded-full bg-neutral-700"
            />
          ))}
        </div>
        <SkeletonBox className="h-80 w-full rounded-lg bg-neutral-800" />
      </div>
    </div>
  );
}
