import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function PlayEditorSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-slate-950">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-9 w-9 rounded-md" />
          <SkeletonBox className="h-6 w-40" />
        </div>
        <SkeletonBox className="h-9 w-24 rounded-md" />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
        <div className="flex flex-1 justify-center">
          <SkeletonBox className="aspect-[100/94] w-full max-w-2xl rounded-xl" />
        </div>
        <div className="w-full shrink-0 space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 lg:w-72">
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
