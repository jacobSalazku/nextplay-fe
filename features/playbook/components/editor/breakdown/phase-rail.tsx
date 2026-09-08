'use client';

import { useEffect, useRef, useState } from 'react';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { MAX_PHASES } from '@/features/playbook/utils/editor/phase-rail';
import { cn } from '@/utils/tw-merge';
import { Copy, MoreVertical, Plus, Trash2 } from 'lucide-react';

const DRAG_THRESHOLD = 4; // px before a press becomes a drag

function PhaseMenu({
  onDuplicate,
  onDelete,
}: {
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  if (!onDuplicate && !onDelete) return null;

  const item =
    'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-black/5';

  return (
    <div ref={ref} className="absolute top-1 right-1 z-10">
      <button
        type="button"
        aria-label="Phase options"
        aria-expanded={open}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((o) => !o)}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md bg-[#1f2d4d]/85 text-white transition hover:bg-[#1f2d4d]"
      >
        <MoreVertical className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 overflow-hidden rounded-lg border border-[#d8cbac] bg-[#faf6ec] py-1 text-[#1f2d4d] shadow-lg">
          {onDuplicate && (
            <button
              type="button"
              className={item}
              onClick={() => {
                onDuplicate();
                setOpen(false);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={cn(item, 'text-red-700')}
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

type PhaseRailProps = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd?: () => void;
  onDelete?: (index: number) => void;
  onDuplicate?: (index: number) => void;
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
  onDuplicate,
  onReorder,
  className,
}: PhaseRailProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const moved = useRef(false);
  const [drag, setDrag] = useState<{ from: number; insertAt: number } | null>(
    null,
  );

  const insertAtFor = (clientY: number) =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[data-phase]') ?? [],
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      return (r.top + r.bottom) / 2 < clientY;
    }).length;

  const onPointerDown = (index: number) => (e: React.PointerEvent) => {
    if (!onReorder) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startY.current = e.clientY;
    moved.current = false;
    setDrag({ from: index, insertAt: index });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    if (Math.abs(e.clientY - startY.current) > DRAG_THRESHOLD) {
      moved.current = true;
    }
    if (moved.current) {
      setDrag({ from: drag.from, insertAt: insertAtFor(e.clientY) });
    }
  };

  const onPointerUp = (e: React.PointerEvent, index: number) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const current = drag;
    setDrag(null);

    if (!current || !moved.current || !onReorder) {
      onSelect(index);
      return;
    }
    const { from, insertAt } = current;
    const to = insertAt > from ? insertAt - 1 : insertAt;
    if (to !== from) {
      onReorder(from, Math.max(0, Math.min(to, phases.length - 1)));
    }
  };

  const dropLine = (
    <div className="mx-1 h-[3px] shrink-0 rounded-full bg-[#1f2d4d]" />
  );

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
        className="flex min-h-0 flex-1 touch-none flex-col gap-2 overflow-y-auto"
      >
        {phases.map((phase, index) => (
          <div key={phase.id}>
            {drag?.insertAt === index && dropLine}
            <div
              data-phase
              className={cn(
                'group relative',
                drag?.from === index && 'opacity-40',
              )}
            >
              <button
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-current={index === activeIndex}
                aria-label={`Phase ${index + 1}`}
                onPointerDown={onPointerDown(index)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, index)}
                onPointerCancel={() => setDrag(null)}
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

              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold',
                  index === activeIndex
                    ? 'bg-[#1f2d4d] text-white'
                    : 'bg-white/85 text-[#1f2d4d]',
                )}
              >
                {index + 1}
              </span>

              <PhaseMenu
                onDuplicate={
                  onDuplicate && phases.length < MAX_PHASES
                    ? () => onDuplicate(index)
                    : undefined
                }
                onDelete={
                  onDelete && phases.length > 1
                    ? () => onDelete(index)
                    : undefined
                }
              />
            </div>
          </div>
        ))}

        {drag?.insertAt === phases.length && dropLine}

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
