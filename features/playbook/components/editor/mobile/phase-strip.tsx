'use client';

import { useState } from 'react';
import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { MAX_PHASES } from '@/features/playbook/utils/editor/phase-rail';
import { cn } from '@/utils/tw-merge';
import { Plus } from 'lucide-react';
import { AddPhaseMenu } from './add-phase-menu';

type Props = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  fill?: boolean;
  onSelect: (index: number) => void;
  onAddEmpty: () => void;
  onDuplicate: (index: number) => void;
};

// `fill` sizes the tiles to the container height instead of a fixed width.
export function PhaseStrip({
  phases,
  court,
  activeIndex,
  fill = false,
  onSelect,
  onAddEmpty,
  onDuplicate,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const { w, h } = COURT_VIEWBOX[court];
  const tile = fill ? 'h-full' : 'w-28';
  const tileStyle = fill ? { aspectRatio: `${w} / ${h}` } : undefined;

  return (
    <div
      role="tablist"
      aria-label="Phases"
      className={cn(
        'flex gap-2 overflow-x-auto rounded-xl bg-[#e9dcc0] p-2',
        fill ? 'h-full' : 'shrink-0',
      )}
    >
      {phases.map((phase, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={phase.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Phase ${index + 1}`}
            onClick={() => onSelect(index)}
            style={tileStyle}
            className={cn(
              'relative shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition',
              tile,
              active ? 'border-[#1f2d4d]' : 'border-[#cdb894]',
            )}
          >
            <CourtDiagram
              court={court}
              phase={phase}
              className={cn(
                'pointer-events-none block',
                fill ? 'h-full w-full' : 'w-full',
              )}
            />
            <span
              aria-hidden
              className={cn(
                'absolute bottom-0.5 left-0.5 flex items-center justify-center rounded font-bold',
                fill ? 'h-6 w-6 text-sm' : 'h-4 w-4 text-[10px]',
                active
                  ? 'bg-[#1f2d4d] text-white'
                  : 'bg-white/85 text-[#1f2d4d]',
              )}
            >
              {index + 1}
            </span>
          </button>
        );
      })}

      {phases.length < MAX_PHASES && (
        <button
          type="button"
          aria-label="Add phase"
          onClick={() => setAddOpen(true)}
          style={tileStyle}
          className={cn(
            'flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#cdb894] text-[#a89372]',
            fill ? 'h-full' : 'aspect-[100/94] w-28',
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      )}

      <AddPhaseMenu
        open={addOpen}
        variant="sheet"
        activeIndex={activeIndex}
        onClone={() => onDuplicate(activeIndex)}
        onEmpty={onAddEmpty}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
