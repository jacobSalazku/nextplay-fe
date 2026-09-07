'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/tw-merge';
import { MoreVertical } from 'lucide-react';
import { durationLabel } from './labels';
import { DURATIONS } from './steps';

type Props = {
  durationMs: number;
  onDuration: (ms: number) => void;
  onRemove: () => void;
  onMergeUp?: () => void;
  onSplitOut?: () => void;
};

export function TimingMenu({
  durationMs,
  onDuration,
  onRemove,
  onMergeUp,
  onSplitOut,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const item = 'w-full cursor-pointer px-3 py-1.5 text-left hover:bg-black/5';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Timing options"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded p-1 text-[#b9ac8e] transition hover:bg-black/5 hover:text-[#1f2d4d]"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-[#e6dcc4] bg-[#faf6ec] py-1 text-sm text-[#1f2d4d] shadow-lg">
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              type="button"
              onClick={() => {
                onDuration(d.ms);
                setOpen(false);
              }}
              className={cn(
                'flex items-center justify-between',
                item,
                d.ms === durationMs && 'font-semibold',
              )}
            >
              {d.label}
              <span className="font-mono text-xs text-[#a89372]">
                {durationLabel(d.ms)}
              </span>
            </button>
          ))}

          {(onMergeUp || onSplitOut) && (
            <div className="my-1 border-t border-[#e6dcc4]" />
          )}
          {onMergeUp && (
            <button
              type="button"
              onClick={() => {
                onMergeUp();
                setOpen(false);
              }}
              className={item}
            >
              Run with step above
            </button>
          )}
          {onSplitOut && (
            <button
              type="button"
              onClick={() => {
                onSplitOut();
                setOpen(false);
              }}
              className={item}
            >
              Run on its own
            </button>
          )}

          <div className="my-1 border-t border-[#e6dcc4]" />
          <button
            type="button"
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className={cn(item, 'text-red-700')}
          >
            Remove action
          </button>
        </div>
      )}
    </div>
  );
}
