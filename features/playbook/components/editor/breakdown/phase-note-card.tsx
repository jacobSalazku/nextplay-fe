'use client';

import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';

// One phase in the Breakdown list: its diagram and an editable note.
export function PhaseNoteCard({
  index,
  phase,
  court,
  onNoteChange,
  onEditStart,
  onEditEnd,
}: {
  index: number;
  phase: Phase;
  court: CourtType;
  onNoteChange: (index: number, note: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-white/10 bg-slate-900/40 p-4">
      <div className="w-36 shrink-0">
        <CourtDiagram
          court={court}
          phase={phase}
          ballHolderId={phase.ballHolderId}
          className="w-full rounded-lg"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-sm font-semibold">Phase {index + 1}</h3>
        <textarea
          aria-label={`Phase ${index + 1} note`}
          value={phase.note ?? ''}
          onFocus={onEditStart}
          onBlur={onEditEnd}
          onChange={(event) => onNoteChange(index, event.target.value)}
          placeholder="What happens in this phase…"
          rows={4}
          className="w-full flex-1 resize-y rounded-lg bg-slate-800 p-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
    </div>
  );
}
