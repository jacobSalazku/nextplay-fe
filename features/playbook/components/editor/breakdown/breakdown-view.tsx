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
  onAddPhase: () => void;
  onDeletePhase: (index: number) => void;
  onReorderPhase: (from: number, to: number) => void;
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
  onAddPhase,
  onDeletePhase,
  onReorderPhase,
  onCategoryChange,
  onNoteChange,
  onEditStart,
  onEditEnd,
}: BreakdownProps) {
  const phase = phases[activeIndex];

  return (
    <div className="flex min-h-0 flex-1 justify-center overflow-y-auto p-6">
      <div className="flex h-full w-full max-w-5xl items-start gap-5">
        <PhaseRail
          phases={phases}
          court={court}
          activeIndex={activeIndex}
          onSelect={onSelectPhase}
          onAdd={onAddPhase}
          onDelete={onDeletePhase}
          onReorder={onReorderPhase}
        />

        <div className="flex flex-1 flex-col rounded-2xl bg-[#faf6ec] p-5 text-slate-900">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">
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
    </div>
  );
}
