'use client';

import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import type { Category } from '@/graphql/graphql';
import { PhaseNoteCard } from './phase-note-card';
import { PlayMeta } from './play-meta';

// The Breakdown tab: play metadata + a note per phase.
export function BreakdownView({
  name,
  category,
  court,
  phases,
  onRename,
  onCategoryChange,
  onNoteChange,
  onEditStart,
  onEditEnd,
}: {
  name: string;
  category: Category;
  court: CourtType;
  phases: Phase[];
  onRename: (name: string) => void;
  onCategoryChange: (category: Category) => void;
  onNoteChange: (index: number, note: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 overflow-y-auto p-4">
      <PlayMeta
        name={name}
        category={category}
        onRename={onRename}
        onCategoryChange={onCategoryChange}
      />

      {phases.map((phase, index) => (
        <PhaseNoteCard
          key={phase.id}
          index={index}
          phase={phase}
          court={court}
          onNoteChange={onNoteChange}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />
      ))}
    </div>
  );
}
