'use client';

import { PhaseThumbnail } from '@/features/playbook/components/diagram/phase-thumbnail';
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
        'flex w-52 shrink-0 flex-col gap-2 overflow-y-auto rounded-2xl bg-[#e9dcc0] p-3',
        className,
      )}
    >
      <p className="px-0.5 pb-1 text-xs font-semibold tracking-wider text-[#7a6a52] uppercase">
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
            'block w-full shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition',
            index === activeIndex
              ? 'border-[#1f2d4d]'
              : 'border-[#cdb894] hover:border-[#1f2d4d]/40',
          )}
        >
          <PhaseThumbnail
            court={court}
            phase={phase}
            className="pointer-events-none block aspect-[3/2] w-full"
          />
        </button>
      ))}
    </nav>
  );
}
