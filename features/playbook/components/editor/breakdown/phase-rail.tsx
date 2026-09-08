'use client';

import { useRef, useState } from 'react';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import {
  MAX_PHASES,
  phaseIndexAt,
} from '@/features/playbook/utils/editor/phase-rail';
import { cn } from '@/utils/tw-merge';
import { Plus, X } from 'lucide-react';

const DRAG_THRESHOLD = 4; // px before a press becomes a drag

type PhaseRailProps = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd?: () => void;
  onDelete?: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
  className?: string;
};

export function PhaseRail({
  phases,
  court,
  activeIndex,
  onSelect,
  onAdd,
  onDelete,
  onReorder,
  className,
}: PhaseRailProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const moved = useRef(false);
  const [drag, setDrag] = useState<{ from: number; dy: number } | null>(null);

  const onPointerDown = (index: number) => (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startY.current = event.clientY;
    moved.current = false;
    setDrag({ from: index, dy: 0 });
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag) return;
    const dy = event.clientY - startY.current;
    if (Math.abs(dy) > DRAG_THRESHOLD) moved.current = true;
    setDrag({ from: drag.from, dy });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const current = drag;
    setDrag(null);
    if (!current) return;

    if (!moved.current || !onReorder) {
      onSelect(current.from);
      return;
    }
    const bounds = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[data-phase]') ?? [],
    ).map((el) => {
      const r = el.getBoundingClientRect();
      return { start: r.top, end: r.bottom };
    });
    onReorder(current.from, phaseIndexAt(bounds, event.clientY));
  };

  return (
    <nav
      aria-label="Phases"
      className={cn(
        'flex w-52 shrink-0 flex-col rounded-2xl bg-[#e9dcc0] p-3',
        className,
      )}
    >
      <p className="px-0.5 pb-2 text-xs font-semibold tracking-wider text-[#7a6a52] uppercase">
        Phase {activeIndex + 1} / {phases.length}
      </p>

      <div
        ref={listRef}
        role="tablist"
        aria-label="Phases"
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDrag(null)}
      >
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            data-phase
            className="group relative shrink-0"
            style={
              drag?.from === index
                ? { transform: `translateY(${drag.dy}px)`, zIndex: 10 }
                : undefined
            }
          >
            <button
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-current={index === activeIndex}
              aria-label={`Phase ${index + 1}`}
              onPointerDown={onPointerDown(index)}
              className={cn(
                'block w-full cursor-pointer touch-none overflow-hidden rounded-lg border-2 transition',
                index === activeIndex
                  ? 'border-[#1f2d4d]'
                  : 'border-[#cdb894] hover:border-[#1f2d4d]/40',
              )}
            >
              <CourtDiagram
                court={court}
                phase={phase}
                className="pointer-events-none block w-full"
              />
            </button>

            {onDelete && phases.length > 1 && (
              <button
                type="button"
                aria-label={`Delete phase ${index + 1}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onDelete(index)}
                className="absolute top-1 right-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[#1f2d4d]/85 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        ))}

        {onAdd && phases.length < MAX_PHASES && (
          <button
            type="button"
            aria-label="Add phase"
            onClick={onAdd}
            className="flex aspect-[100/94] w-full shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#cdb894] text-[#a89372] transition hover:border-[#1f2d4d]/40 hover:text-[#1f2d4d]"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
    </nav>
  );
}
