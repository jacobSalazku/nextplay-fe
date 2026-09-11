'use client';

import { useRef, useState } from 'react';
import { AddPhaseMenu } from '../mobile/add-phase-menu';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import { useDismiss } from '@/features/playbook/hooks/editor/use-dismiss';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { MAX_PHASES } from '@/features/playbook/utils/editor/phase-rail';
import { cn } from '@/utils/tw-merge';
import { Copy, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  useDismiss(open, () => setOpen(false), ref);

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
  onAddEmpty?: () => void;
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
  onAddEmpty,
  onDelete,
  onDuplicate,
  onReorder,
  className,
}: PhaseRailProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  // live drag bookkeeping — a ref so a pointermove never reads a stale closure
  const press = useRef<{
    from: number;
    startX: number;
    startY: number;
    w: number;
    moved: boolean;
  } | null>(null);
  // set only once the drag is real; drives the drop line + floating thumbnail
  const [drag, setDrag] = useState<{
    from: number;
    insertAt: number;
    x: number;
    y: number;
    w: number;
  } | null>(null);

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
    press.current = {
      from: index,
      startX: e.clientX,
      startY: e.clientY,
      w: e.currentTarget.getBoundingClientRect().width,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p) return;
    if (
      !p.moved &&
      (Math.abs(e.clientX - p.startX) > DRAG_THRESHOLD ||
        Math.abs(e.clientY - p.startY) > DRAG_THRESHOLD)
    ) {
      p.moved = true;
    }
    if (p.moved) {
      setDrag({
        from: p.from,
        insertAt: insertAtFor(e.clientY),
        x: e.clientX,
        y: e.clientY,
        w: p.w,
      });
    }
  };

  const endDrag = () => {
    press.current = null;
    setDrag(null);
  };

  const onPointerUp = (e: React.PointerEvent, index: number) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const p = press.current;
    const dropAt = drag?.insertAt;
    endDrag();

    if (!p || !p.moved || !onReorder || dropAt === undefined) {
      onSelect(index);
      return;
    }
    const to = dropAt > p.from ? dropAt - 1 : dropAt;
    if (to !== p.from) {
      onReorder(p.from, Math.max(0, Math.min(to, phases.length - 1)));
    }
  };

  // absolutely positioned so showing it never nudges the cards
  const dropLine = (edge: 'top' | 'bottom') => (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-1 z-20 h-[3px] -translate-y-1/2 rounded-full bg-[#1f2d4d]',
        edge === 'top' ? '-top-1' : '-bottom-[3px]',
      )}
    />
  );

  return (
    <nav
      aria-label="Phases"
      className={cn(
        'flex w-[clamp(6rem,13vw,13rem)] shrink-0 flex-col rounded-2xl bg-[#e9dcc0] p-2 xl:p-3',
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
          <div
            key={phase.id}
            data-phase
            className={cn(
              'group relative',
              drag?.from === index && 'opacity-30',
            )}
          >
            {drag?.insertAt === index && dropLine('top')}
            {drag?.insertAt === phases.length &&
              index === phases.length - 1 &&
              dropLine('bottom')}
            <button
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-current={index === activeIndex}
              aria-label={`Phase ${index + 1}`}
              onPointerDown={onPointerDown(index)}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => onPointerUp(e, index)}
              onPointerCancel={endDrag}
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
        ))}

        {onAdd && phases.length < MAX_PHASES && (
          <button
            type="button"
            aria-label="Add phase"
            onClick={onAddEmpty && onDuplicate ? () => setAddOpen(true) : onAdd}
            className="flex aspect-[100/94] w-full shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#cdb894] text-[#a89372] transition hover:border-[#1f2d4d]/40 hover:text-[#1f2d4d]"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {onAddEmpty && onDuplicate && (
        <AddPhaseMenu
          open={addOpen}
          variant="dialog"
          activeIndex={activeIndex}
          onClone={() => onDuplicate(activeIndex)}
          onEmpty={onAddEmpty}
          onClose={() => setAddOpen(false)}
        />
      )}

      {drag &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-2 overflow-hidden rounded-lg border-2 border-[#1f2d4d] opacity-90 shadow-xl shadow-black/30"
            style={{ left: drag.x, top: drag.y, width: drag.w }}
          >
            <CourtDiagram
              court={court}
              phase={phases[drag.from]}
              className="block w-full"
            />
          </div>,
          document.body,
        )}
    </nav>
  );
}
