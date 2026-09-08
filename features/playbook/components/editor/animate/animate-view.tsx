'use client';

import { useEffect, useState } from 'react';
import { PhaseRail } from '../breakdown/phase-rail';
import { useAnimationClock } from '@/features/playbook/hooks/editor/use-animation-clock';
import {
  animationDurationMs,
  interpolateFrame,
  phaseStartProgress,
  resolveFrame,
} from '@/features/playbook/utils/diagram/interpolate';
import type {
  CourtType,
  Phase,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { isTypingTarget } from '@/features/playbook/utils/editor/keyboard';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { AnimationStage } from './animation-stage';
import { ActionTimeline } from './timeline/action-timeline';
import { TransportBar } from './transport-bar';

type Props = {
  court: CourtType;
  phases: Phase[];
  onStepsChange: (index: number, steps: Step[]) => void;
  onEditStart: () => void;
  onRemoveAction: (index: number, id: string) => void;
};

export function AnimateView({
  court,
  phases,
  onStepsChange,
  onEditStart,
  onRemoveAction,
}: Props) {
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  // which phase's timeline is being edited — a direct selection, not derived
  // from the scrubber (a progress round-trip lands on the wrong side of a
  // segment boundary half the time)
  const [selected, setSelected] = useState(0);
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

  const frame = interpolateFrame(phases, progress, reduce);

  // during playback the panel follows what is on screen; when paused it follows
  // the last phase the coach clicked or scrubbed to
  const activeIndex = playing
    ? frame.fromIndex
    : Math.min(selected, phases.length - 1);
  const active = phases[activeIndex];

  const selectPhase = (index: number) => {
    setSelected(index);
    seek(phaseStartProgress(phases, index));
  };

  const scrubTo = (next: number) => {
    seek(next);
    setSelected(resolveFrame(phases, next).fromIndex);
  };

  return (
    <div className="flex flex-1 gap-3 overflow-hidden p-3">
      <PhaseRail
        phases={phases}
        court={court}
        activeIndex={activeIndex}
        onSelect={selectPhase}
        className="w-52"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <AnimationStage
            court={court}
            phases={phases}
            frame={frame}
            title={`Phase ${activeIndex + 1}`}
          />
        </div>

        <TransportBar
          playing={playing}
          progress={progress}
          phaseCount={phases.length}
          speed={speed}
          loop={loop}
          onToggle={toggle}
          onRestart={restart}
          onSeek={scrubTo}
          onSpeed={setSpeed}
          onLoop={setLoop}
        />
      </div>

      <ActionTimeline
        phaseNumber={activeIndex + 1}
        actions={active.actions}
        objects={active.objects}
        steps={active.steps}
        onChange={(steps) => {
          onEditStart();
          onStepsChange(activeIndex, steps);
        }}
        onRemoveAction={(id) => onRemoveAction(activeIndex, id)}
        onPlay={restart}
      />
    </div>
  );
}
