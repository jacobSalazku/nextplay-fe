'use client';

import { useEffect, useRef, useState } from 'react';
import { PhaseRail } from '../breakdown/phase-rail';
import { StageColumn } from '../stage-column';
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
  activeIndex: number;
  onSelectPhase: (index: number) => void;
  onAddPhase: () => void;
  onDeletePhase: (index: number) => void;
  onDuplicatePhase: (index: number) => void;
  onReorderPhase: (from: number, to: number) => void;
  onStepsChange: (index: number, steps: Step[]) => void;
  onEditStart: () => void;
  onRemoveAction: (index: number, id: string) => void;
};

export function AnimateView({
  court,
  phases,
  activeIndex,
  onSelectPhase,
  onAddPhase,
  onDeletePhase,
  onDuplicatePhase,
  onReorderPhase,
  onStepsChange,
  onEditStart,
  onRemoveAction,
}: Props) {
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const reduce = useReducedMotion();

  // the transport bar tracks the court's rendered width so the two line up
  const stageRef = useRef<HTMLDivElement>(null);
  const [courtWidth, setCourtWidth] = useState<number>();
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCourtWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
  // the selected phase
  const shownIndex = playing ? frame.fromIndex : activeIndex;
  const shown = phases[shownIndex] ?? phases[0];

  const selectPhase = (index: number) => {
    onSelectPhase(index);
    seek(phaseStartProgress(phases, index));
  };

  const scrubTo = (next: number) => {
    seek(next);
    onSelectPhase(resolveFrame(phases, next).fromIndex);
  };

  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
      <PhaseRail
        phases={phases}
        court={court}
        activeIndex={shownIndex}
        onSelect={selectPhase}
        onAdd={onAddPhase}
        onDelete={onDeletePhase}
        onDuplicate={onDuplicatePhase}
        onReorder={onReorderPhase}
      />

      <StageColumn
        controls={
          <div
            className="w-full max-w-full"
            style={courtWidth ? { width: courtWidth } : undefined}
          >
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
        }
      >
        <AnimationStage
          ref={stageRef}
          court={court}
          phases={phases}
          frame={frame}
          title={`Phase ${shownIndex + 1}`}
        />
      </StageColumn>

      <ActionTimeline
        actions={shown.actions}
        objects={shown.objects}
        steps={shown.steps}
        onChange={(steps) => {
          onEditStart();
          onStepsChange(shownIndex, steps);
        }}
        onRemoveAction={(id) => onRemoveAction(shownIndex, id)}
      />
    </div>
  );
}
