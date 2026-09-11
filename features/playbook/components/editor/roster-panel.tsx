'use client';

import {
  RosterSections,
  type RosterSectionsProps,
} from './roster/roster-sections';

export function RosterPanel(props: RosterSectionsProps) {
  return (
    <aside
      aria-label="Roster"
      className="w-[clamp(9rem,18vw,19rem)] shrink-0 space-y-6 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3 xl:p-4"
    >
      <RosterSections {...props} />
    </aside>
  );
}
