import { SkeletonBox } from '@/components/skeleton/skeleton-box';

export default function PlayEditorSkeleton() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-9 w-9 rounded-md" />
          <SkeletonBox className="h-6 w-40" />
        </div>
        <SkeletonBox className="h-9 w-24 rounded-md" />
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3 lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <SkeletonBox className="aspect-[100/84] h-full max-w-full rounded-xl" />
          </div>
          <SkeletonBox className="mx-auto h-14 w-80 shrink-0 rounded-2xl" />
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
