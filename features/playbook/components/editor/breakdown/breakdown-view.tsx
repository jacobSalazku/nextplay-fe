'use client';

import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import type { Category } from '@/graphql/graphql';
import { CategoryPicker } from './category-picker';
import { PhaseNotesEditor } from './phase-notes-editor';
import { PhaseRail } from './phase-rail';

type BreakdownProps = {
  category: Category;
  court: CourtType;
  phases: Phase[];
  activeIndex: number;
  onSelectPhase: (index: number) => void;
  onCategoryChange: (category: Category) => void;
  onNoteChange: (index: number, note: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
};

// The Breakdown tab: a phase rail on the left, the selected phase's step notes
// on the right.
export function BreakdownView({
  category,
  court,
  phases,
  activeIndex,
  onSelectPhase,
  onCategoryChange,
  onNoteChange,
  onEditStart,
  onEditEnd,
}: BreakdownProps) {
  const phase = phases[activeIndex];

  return (
    <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-3">
      <PhaseRail
        phases={phases}
        court={court}
        activeIndex={activeIndex}
        onSelect={onSelectPhase}
      />

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-[#faf6ec] p-6 text-slate-900">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold">
            Phase {activeIndex + 1}
            <span className="ml-2 align-middle text-sm font-normal text-slate-500">
              Step notes
            </span>
          </h2>
          <CategoryPicker value={category} onChange={onCategoryChange} />
        </div>

        <PhaseNotesEditor
          phaseId={phase.id}
          content={phase.note ?? ''}
          onChange={(html) => onNoteChange(activeIndex, html)}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />
      </div>
    </div>
  );
}
