'use client';

import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';

type PhaseRailProps = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  onSelect: (index: number) => void;
};

// The vertical phase navigator on the Breakdown screen.
export function PhaseRail({
  phases,
  court,
  activeIndex,
  onSelect,
}: PhaseRailProps) {
  return (
    <nav
      aria-label="Phases"
      className="flex w-40 shrink-0 flex-col gap-3 overflow-y-auto"
    >
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Phase {activeIndex + 1} / {phases.length}
      </p>

      {phases.map((phase, index) => (
        <button
          key={phase.id}
          type="button"
          aria-label={`Phase ${index + 1}`}
          aria-current={index === activeIndex}
          onClick={() => onSelect(index)}
          className={cn(
            'block w-full cursor-pointer overflow-hidden rounded-lg border-2 transition',
            index === activeIndex
              ? 'border-orange-400'
              : 'border-transparent hover:border-black/15',
          )}
        >
          <CourtDiagram
            court={court}
            phase={phase}
            className="pointer-events-none block w-full"
          />
        </button>
      ))}
    </nav>
  );
}
