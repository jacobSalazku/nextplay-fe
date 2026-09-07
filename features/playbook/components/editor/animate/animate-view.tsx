'use client';

import { useEffect, useState } from 'react';
import { useAnimationClock } from '@/features/playbook/hooks/editor/use-animation-clock';
import {
  animationDurationMs,
  interpolateFrame,
} from '@/features/playbook/utils/diagram/interpolate';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { isTypingTarget } from '@/features/playbook/utils/editor/keyboard';
import { AnimationStage } from './animation-stage';
import { TransportBar } from './transport-bar';

type Props = {
  court: CourtType;
  phases: Phase[];
};

export function AnimateView({ court, phases }: Props) {
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);

  const durationMs = animationDurationMs(phases.length) / speed;
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

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2">
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <AnimationStage
          court={court}
          phases={phases}
          frame={interpolateFrame(phases, progress)}
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
        onSeek={seek}
        onSpeed={setSpeed}
        onLoop={setLoop}
      />
    </div>
  );
}
