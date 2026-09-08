import type { ReactNode } from 'react';

// The centre column that holds the court in every editor tab. Same structure
// everywhere — court centred in the space above, a fixed-height controls row
// below — so the court sits in the same place whichever tab you're on.
export function StageColumn({
  children,
  controls,
}: {
  children: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center gap-3">
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        {children}
      </div>
      <div className="flex min-h-12 w-full shrink-0 items-center justify-center">
        {controls}
      </div>
    </div>
  );
}
