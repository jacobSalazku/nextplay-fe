export const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-neutral-800 ${className}`} />
);
