'use client';

import { useEffect, useState } from 'react';
import { PhaseRail } from '../breakdown/phase-rail';
import { useAnimationClock } from '@/features/playbook/hooks/editor/use-animation-clock';
import {
  animationDurationMs,
  interpolateFrame,
  phaseStartProgress,
} from '@/features/playbook/utils/diagram/interpolate';
import type {
  CourtType,
  Phase,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { isTypingTarget } from '@/features/playbook/utils/editor/keyboard';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { AnimationStage } from './animation-stage';
import { SequenceGroups } from './sequence-groups';
import { TransportBar } from './transport-bar';

type Props = {
  court: CourtType;
  phases: Phase[];
  onStepsChange: (index: number, steps: Step[]) => void;
  onEditStart: () => void;
};

export function AnimateView({
  court,
  phases,
  onStepsChange,
  onEditStart,
}: Props) {
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const reduce = useReducedMotion();

  const durationMs = animationDurationMs(phases) / speed;
  const { progress, playing, toggle, seek, restart } = useAnimationClock({
    durationMs,
    loop,
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTypingTarget(event.target)) return;
      if ((event.target as HTMLElement | null)?.tagName === 'BUTTON') return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  if (phases.length < 2) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="max-w-xs text-center text-sm text-gray-400">
          Add a second phase in Draw mode to animate the play.
        </p>
      </div>
    );
  }

  const frame = interpolateFrame(phases, progress, reduce);
  const from = phases[frame.fromIndex];

  return (
    <div className="flex flex-1 gap-2 overflow-hidden p-2">
      <PhaseRail
        phases={phases}
        court={court}
        activeIndex={frame.fromIndex}
        onSelect={(index) => seek(phaseStartProgress(phases, index))}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <AnimationStage court={court} phases={phases} frame={frame} />
        </div>

        <TransportBar
          playing={playing}
          progress={progress}
          phaseCount={phases.length}
          speed={speed}
          loop={loop}
          onToggle={toggle}
          onRestart={restart}
          onSeek={seek}
          onSpeed={setSpeed}
          onLoop={setLoop}
        />
      </div>

      <SequenceGroups
        transitionLabel={`Phase ${frame.fromIndex + 1} → ${frame.toIndex + 1}`}
        actions={from.actions}
        objects={from.objects}
        steps={from.steps}
        onChange={(steps) => {
          onEditStart();
          onStepsChange(frame.fromIndex, steps);
        }}
      />
    </div>
  );
}
