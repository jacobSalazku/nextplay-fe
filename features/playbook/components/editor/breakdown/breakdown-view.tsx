'use client';

import { StageColumn } from '../stage-column';
import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
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
  onDuplicatePhase: (index: number) => void;
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
  onDuplicatePhase,
  onReorderPhase,
  onCategoryChange,
  onNoteChange,
  onEditStart,
  onEditEnd,
}: BreakdownProps) {
  const phase = phases[activeIndex];
  const { w, h } = COURT_VIEWBOX[court];

  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
      <PhaseRail
        phases={phases}
        court={court}
        activeIndex={activeIndex}
        onSelect={onSelectPhase}
        onAdd={onAddPhase}
        onDelete={onDeletePhase}
        onDuplicate={onDuplicatePhase}
        onReorder={onReorderPhase}
      />

      <StageColumn>
        <div
          className="relative h-full max-w-full"
          style={{ aspectRatio: `${w} / ${h}` }}
        >
          <CourtDiagram
            court={court}
            phase={phase}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </StageColumn>

      <section
        aria-label="Phase notes"
        className="flex max-h-full w-80 shrink-0 flex-col self-start overflow-hidden rounded-2xl bg-[#faf6ec] text-slate-900"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[#e6dcc4] px-5 py-3.5">
          <h2 className="text-xs font-semibold tracking-wider text-[#8a7a5c] uppercase">
            Step notes
          </h2>
          <CategoryPicker value={category} onChange={onCategoryChange} />
        </header>

        <div className="flex min-h-0 flex-1 flex-col p-4">
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
