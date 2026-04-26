import { SkeletonBox } from "./skeleton-box";

export const PlayCardSkeleton = () => (
  <div className="w-[240px] space-y-4 rounded-xl border border-neutral-700 bg-neutral-900 p-4">
    <SkeletonBox className="h-5 w-20 rounded-full" />
    <SkeletonBox className="h-32 w-full rounded-lg" />
    <SkeletonBox className="h-4 w-32" />
    <div className="flex justify-between gap-2">
      <SkeletonBox className="h-8 w-24 rounded-md" />
      <SkeletonBox className="h-8 w-16 rounded-md bg-red-800" />
    </div>
  </div>
);
