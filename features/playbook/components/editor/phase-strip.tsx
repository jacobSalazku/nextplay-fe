'use client';

import { useRef, useState } from 'react';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import {
  MAX_PHASES,
  phaseIndexAtX,
} from '@/features/playbook/utils/editor/phase-strip';
import { cn } from '@/utils/tw-merge';
import { Plus, X } from 'lucide-react';

type Props = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onReorder: (from: number, to: number) => void;
};

const DRAG_THRESHOLD = 4; // px before a press becomes a drag

export function PhaseStrip({
  phases,
  court,
  activeIndex,
  onSelect,
  onAdd,
  onDelete,
  onReorder,
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const moved = useRef(false);
  const [drag, setDrag] = useState<{ from: number; dx: number } | null>(null);

  const onPointerDown = (index: number) => (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startX.current = event.clientX;
    moved.current = false;
    setDrag({ from: index, dx: 0 });
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag) return;
    const dx = event.clientX - startX.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) moved.current = true;
    setDrag({ from: drag.from, dx });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const current = drag;
    setDrag(null);
    if (!current) return;

    if (!moved.current) {
      onSelect(current.from);
      return;
    }
    const bounds = Array.from(
      rowRef.current?.querySelectorAll<HTMLElement>('[data-thumb]') ?? [],
    ).map((el) => el.getBoundingClientRect());
    onReorder(current.from, phaseIndexAtX(bounds, event.clientX));
  };

  return (
    <div
      ref={rowRef}
      role="tablist"
      aria-label="Phases"
      className="flex items-center gap-2 overflow-x-auto px-1 py-1"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
    >
      {phases.map((phase, index) => (
        <div
          key={phase.id}
          data-thumb
          className="relative shrink-0"
          style={
            drag?.from === index
              ? { transform: `translateX(${drag.dx}px)`, zIndex: 10 }
              : undefined
          }
        >
          <button
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Phase ${index + 1}${index === activeIndex ? ', current' : ''}`}
            onPointerDown={onPointerDown(index)}
            className={cn(
              'block w-20 touch-none overflow-hidden rounded-md border bg-slate-800',
              index === activeIndex
                ? 'border-orange-400 ring-1 ring-orange-400'
                : 'border-white/10 hover:border-white/25',
            )}
          >
            <CourtDiagram
              court={court}
              phase={phase}
              className="pointer-events-none block w-full"
            />
            <span className="block bg-slate-900/80 py-0.5 text-center text-[11px] font-semibold">
              {index + 1}
            </span>
          </button>

          {phases.length > 1 && (
            <button
              type="button"
              aria-label={`Delete phase ${index + 1}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onDelete(index)}
              className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/80 text-gray-200 hover:bg-red-600 hover:text-white"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      ))}

      {phases.length < MAX_PHASES && (
        <button
          type="button"
          aria-label="Add phase"
          onClick={onAdd}
          className="flex aspect-square w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-white/15 text-gray-500 hover:border-white/30 hover:text-gray-300"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
