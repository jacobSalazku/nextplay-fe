'use client';

import { useEffect, useRef, useState } from 'react';
import { PhaseRail } from '../breakdown/phase-rail';
import { PhaseStrip } from '../mobile/phase-strip';
import { PhaseSwitcher } from '../mobile/phase-switcher';
import { StageColumn } from '../stage-column';
import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
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
import { Play } from 'lucide-react';
import { AnimationStage } from './animation-stage';
import { ActionTimeline } from './timeline/action-timeline';
import { TransportBar } from './transport-bar';

type Props = {
  court: CourtType;
  phases: Phase[];
  activeIndex: number;
  stacked?: boolean;
  compact?: boolean;
  onSelectPhase: (index: number) => void;
  onAddPhase: () => void;
  onAddEmptyPhase: () => void;
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
  stacked = false,
  compact = false,
  onSelectPhase,
  onAddPhase,
  onAddEmptyPhase,
  onDeletePhase,
  onDuplicatePhase,
  onReorderPhase,
  onStepsChange,
  onEditStart,
  onRemoveAction,
}: Props) {
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

  const durationMs = animationDurationMs(phases);
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

  const timeline = (
    <ActionTimeline
      actions={shown.actions}
      objects={shown.objects}
      steps={shown.steps}
      variant={stacked ? 'stacked' : 'panel'}
      onChange={(steps) => {
        onEditStart();
        onStepsChange(shownIndex, steps);
      }}
      onRemoveAction={(id) => onRemoveAction(shownIndex, id)}
    />
  );

  if (stacked) {
    const { w, h } = COURT_VIEWBOX[court];
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
        {!compact && (
          <PhaseStrip
            phases={phases}
            court={court}
            activeIndex={shownIndex}
            onSelect={selectPhase}
            onAddEmpty={onAddEmptyPhase}
            onDuplicate={onDuplicatePhase}
          />
        )}

        <div
          className="relative mx-auto w-full max-w-105 shrink-0"
          style={{ aspectRatio: `${w} / ${h}`, maxHeight: '42vh' }}
        >
          <div className="absolute inset-0">
            <AnimationStage court={court} phases={phases} frame={frame} />
          </div>
          {compact && (
            <div className="absolute top-1.5 left-1.5 z-10">
              <PhaseSwitcher
                phases={phases}
                court={court}
                activeIndex={shownIndex}
                onSelect={selectPhase}
                onAddEmpty={onAddEmptyPhase}
                onDelete={onDeletePhase}
                onDuplicate={onDuplicatePhase}
              />
            </div>
          )}
        </div>

        <TransportBar
          playing={playing}
          progress={progress}
          phaseCount={phases.length}
          loop={loop}
          onToggle={toggle}
          onRestart={restart}
          onSeek={scrubTo}
          onLoop={setLoop}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">{timeline}</div>

        {!compact && (
          <button
            type="button"
            onClick={restart}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1f2d4d] px-4 py-3 text-sm font-semibold text-white"
          >
            <Play className="h-4 w-4" />
            Play full animation
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 gap-2 overflow-hidden p-2 xl:gap-3 xl:p-3">
      <PhaseRail
        phases={phases}
        court={court}
        activeIndex={shownIndex}
        onSelect={selectPhase}
        onAdd={onAddPhase}
        onAddEmpty={onAddEmptyPhase}
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
              loop={loop}
              onToggle={toggle}
              onRestart={restart}
              onSeek={scrubTo}
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

      {timeline}
    </div>
  );
}
