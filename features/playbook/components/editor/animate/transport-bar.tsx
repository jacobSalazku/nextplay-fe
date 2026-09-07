'use client';

import { cn } from '@/utils/tw-merge';
import { Pause, Play, Repeat, SkipBack } from 'lucide-react';

const SPEEDS = [0.5, 1, 2];

type Props = {
  playing: boolean;
  progress: number;
  phaseCount: number;
  speed: number;
  loop: boolean;
  onToggle: () => void;
  onRestart: () => void;
  onSeek: (progress: number) => void;
  onSpeed: (speed: number) => void;
  onLoop: (loop: boolean) => void;
};

export function TransportBar({
  playing,
  progress,
  phaseCount,
  speed,
  loop,
  onToggle,
  onRestart,
  onSeek,
  onSpeed,
  onLoop,
}: Props) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-white/10 bg-slate-900 px-3 py-2">
      <button
        type="button"
        aria-label="Restart"
        onClick={onRestart}
        className="cursor-pointer rounded p-1.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        <SkipBack className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        onClick={onToggle}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-400"
      >
        {playing ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 translate-x-px" />
        )}
      </button>

      <div className="relative flex-1 px-[7px]">
        <div className="pointer-events-none absolute inset-x-[7px] top-1/2 flex -translate-y-1/2 justify-between">
          {Array.from({ length: phaseCount }, (_, i) => (
            <span key={i} className="h-2 w-px bg-white/25" />
          ))}
        </div>
        <input
          type="range"
          aria-label="Timeline"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(event) => onSeek(event.target.valueAsNumber)}
          className="relative w-full cursor-pointer accent-orange-500"
        />
      </div>

      <div
        role="group"
        aria-label="Speed"
        className="flex rounded-md border border-white/10 p-0.5 text-xs"
      >
        {SPEEDS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === speed}
            onClick={() => onSpeed(option)}
            className={cn(
              'cursor-pointer rounded px-1.5 py-0.5 font-medium transition',
              option === speed
                ? 'bg-slate-700 text-white'
                : 'text-gray-400 hover:text-white',
            )}
          >
            {option}×
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Loop"
        aria-pressed={loop}
        onClick={() => onLoop(!loop)}
        className={cn(
          'cursor-pointer rounded p-1.5 transition',
          loop
            ? 'bg-slate-700 text-white'
            : 'text-gray-400 hover:bg-white/10 hover:text-white',
        )}
      >
        <Repeat className="h-4 w-4" />
      </button>
    </div>
  );
}
