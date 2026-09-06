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

// The court plus an invisible drag handle over each token. Handles are HTML,
// positioned in percent over an aspect-locked box, so they line up with the
// SVG underneath on either court size.
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
  const drag = useRef<{ id: string; frame: number } | null>(null);

  const { w, h } = COURT_VIEWBOX[court];

  const startDrag = (id: string) => (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onSelect(id);
    drag.current = { id, frame: 0 };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;
    if (!current) return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(current.frame);
    current.frame = requestAnimationFrame(() => {
      const { x, y } = toCourt({ clientX, clientY });
      onMove(current.id, x, y);
    });
  };

  const endDrag = (event: React.PointerEvent) => {
    if (drag.current) cancelAnimationFrame(drag.current.frame);
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
            'absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full',
            'cursor-grab outline-none active:cursor-grabbing',
            'focus-visible:ring-2 focus-visible:ring-orange-400',
            selectedId === object.id && 'ring-2 ring-orange-400',
          )}
        />
      ))}
    </div>
  );
}
