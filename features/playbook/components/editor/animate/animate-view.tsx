'use client';

import { interpolateFrame } from '@/features/playbook/utils/diagram/interpolate';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { AnimationStage } from './animation-stage';

type Props = {
  court: CourtType;
  phases: Phase[];
};

export function AnimateView({ court, phases }: Props) {
  if (phases.length < 2) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="max-w-xs text-center text-sm text-gray-400">
          Add a second phase in Draw mode to animate the play.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2">
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <AnimationStage
          court={court}
          phases={phases}
          frame={interpolateFrame(phases, 0)}
        />
      </div>
    </div>
  );
}
