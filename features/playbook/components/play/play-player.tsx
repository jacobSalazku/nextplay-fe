'use client';

import { useEffect, useRef, useState } from 'react';
import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { AnimationStage } from '@/features/playbook/components/editor/animate/animation-stage';
import { TransportBar } from '@/features/playbook/components/editor/animate/transport-bar';
import { useAnimationClock } from '@/features/playbook/hooks/editor/use-animation-clock';
import {
  animationDurationMs,
  interpolateFrame,
} from '@/features/playbook/utils/diagram/interpolate';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Read-only playback of a whole play — court + transport, no editing chrome.
export function PlayPlayer({
  court,
  phases,
}: {
  court: CourtType;
  phases: Phase[];
}) {
  const reduce = useReducedMotion();
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);

  const { w, h } = COURT_VIEWBOX[court];
  // a full court is tall and portrait, a half court nearly square — cap each so
  // the hero player never runs off the page
  const stageMax = court === 'full' ? 'max-w-[320px]' : 'max-w-[540px]';

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

  const frame = interpolateFrame(phases, progress, reduce);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div
        ref={stageRef}
        className={`w-full ${stageMax}`}
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <AnimationStage
          court={court}
          phases={phases}
          frame={frame}
          title={`Phase ${frame.fromIndex + 1}`}
        />
      </div>
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
          onSeek={seek}
          onSpeed={setSpeed}
          onLoop={setLoop}
        />
      </div>
    </div>
  );
}
