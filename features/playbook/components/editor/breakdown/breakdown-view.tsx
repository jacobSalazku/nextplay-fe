'use client';

import { PhaseStrip } from '../mobile/phase-strip';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import type { Category } from '@/graphql/graphql';
import { CategoryPicker } from './category-picker';
import { PhaseNotesEditor } from './phase-notes-editor';

type BreakdownProps = {
  category: Category;
  court: CourtType;
  phases: Phase[];
  activeIndex: number;
  onSelectPhase: (index: number) => void;
  onAddEmptyPhase: () => void;
  onDuplicatePhase: (index: number) => void;
  onCategoryChange: (category: Category) => void;
  onNoteChange: (index: number, note: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
};

export function BreakdownView({
  category,
  court,
  phases,
  activeIndex,
  onSelectPhase,
  onAddEmptyPhase,
  onDuplicatePhase,
  onCategoryChange,
  onNoteChange,
  onEditStart,
  onEditEnd,
}: BreakdownProps) {
  const phase = phases[activeIndex];

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 p-2 md:p-3">
      <div className="h-[42%] min-h-0 shrink-0">
        <PhaseStrip
          phases={phases}
          court={court}
          activeIndex={activeIndex}
          fill
          onSelect={onSelectPhase}
          onAddEmpty={onAddEmptyPhase}
          onDuplicate={onDuplicatePhase}
        />
      </div>

      <section
        aria-label="Phase notes"
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#faf6ec] text-slate-900"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[#e6dcc4] px-4 py-3 md:px-5 md:py-3.5">
          <h2 className="text-xs font-semibold tracking-wider text-[#8a7a5c] uppercase">
            Step notes
          </h2>
          <CategoryPicker value={category} onChange={onCategoryChange} />
        </header>

        <div className="flex min-h-0 flex-1 flex-col p-3 md:p-4">
          <PhaseNotesEditor
            phaseId={phase.id}
            content={phase.note ?? ''}
            onChange={(html) => onNoteChange(activeIndex, html)}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
          />
        </div>
      </section>
    </div>
  );
}
