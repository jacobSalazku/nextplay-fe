'use client';

import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';

type PhaseRailProps = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function PhaseRail({
  phases,
  court,
  activeIndex,
  onSelect,
  className,
}: PhaseRailProps) {
  return (
    <nav
      aria-label="Phases"
      className={cn(
        'flex w-44 shrink-0 flex-col gap-2.5 overflow-y-auto',
        className,
      )}
    >
      <p className="px-0.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
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
            'block w-full shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition',
            index === activeIndex
              ? 'border-orange-400'
              : 'border-transparent hover:border-white/25',
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
