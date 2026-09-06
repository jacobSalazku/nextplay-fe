'use client';

import { useRef } from 'react';
import { COURT_VIEWBOX } from '@/features/playbook/diagram/court';
import { CourtDiagram } from '@/features/playbook/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/diagram/types';
import { cn } from '@/utils/tw-merge';
import { useCourtPointer } from './use-court-pointer';

type Props = {
  court: CourtType;
  phase: Phase;
  ballHolderId?: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
};

type DragState = {
  id: string;
  frame: number;
  last: { clientX: number; clientY: number };
};

// The court plus an invisible drag handle over each token. Handles are HTML,
// sized and positioned in percent over an aspect-locked box, so they track the
// SVG tokens underneath on either court size.
export function EditorStage({
  court,
  phase,
  ballHolderId,
  selectedId,
  onSelect,
  onMove,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const toCourt = useCourtPointer(boxRef);
  const drag = useRef<DragState | null>(null);

  const { w, h } = COURT_VIEWBOX[court];

  const applyMove = (id: string, clientX: number, clientY: number) => {
    const point = toCourt({ clientX, clientY });
    if (point) onMove(id, point.x, point.y);
  };

  const startDrag = (id: string) => (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onSelect(id);
    drag.current = {
      id,
      frame: 0,
      last: { clientX: event.clientX, clientY: event.clientY },
    };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;
    if (!current) return;

    current.last = { clientX: event.clientX, clientY: event.clientY };
    cancelAnimationFrame(current.frame);
    current.frame = requestAnimationFrame(() =>
      applyMove(current.id, current.last.clientX, current.last.clientY),
    );
  };

  const endDrag = (event: React.PointerEvent) => {
    const current = drag.current;
    if (current) {
      cancelAnimationFrame(current.frame);
      // flush the release position — the last rAF may not have run
      applyMove(current.id, current.last.clientX, current.last.clientY);
    }
    drag.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div
      ref={boxRef}
      className="relative w-full touch-none select-none"
      style={{ aspectRatio: `${w} / ${h}` }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onSelect(null);
      }}
    >
      <CourtDiagram
        court={court}
        phase={phase}
        ballHolderId={ballHolderId}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {phase.objects.map((object) => (
        <button
          key={object.id}
          type="button"
          aria-label={`Move ${object.label}`}
          onPointerDown={startDrag(object.id)}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ left: `${object.x}%`, top: `${object.y}%` }}
          className={cn(
            'absolute aspect-square w-[9%] min-w-9 -translate-x-1/2 -translate-y-1/2',
            'rounded-full outline-none',
            'cursor-grab active:cursor-grabbing',
            'focus-visible:ring-2 focus-visible:ring-orange-400',
            selectedId === object.id && 'ring-2 ring-orange-400',
          )}
        />
      ))}
    </div>
  );
}
