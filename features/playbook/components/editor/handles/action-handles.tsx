import type {
  Action,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import { ACCENT } from '@/features/playbook/utils/editor/colors';
import {
  actionChord,
  bendHandle,
  type Chord,
} from '@/features/playbook/utils/editor/draw-geometry';

// The bend dot + delete control shown on the selected route.
export function ActionHandles({
  action,
  objects,
  sy,
  onBendPointerDown,
  onDelete,
}: {
  action: Action;
  objects: PlacedObject[];
  sy: number;
  onBendPointerDown: (event: React.PointerEvent, chord: Chord) => void;
  onDelete: () => void;
}) {
  const chord = actionChord(action, objects);
  const handle = bendHandle(action, objects);
  if (!chord || !handle) return null;

  const deleteX = handle.x + 3;
  const deleteY = handle.y * sy - 3;

  return (
    <>
      <g
        role="button"
        aria-label="Bend route"
        style={{ pointerEvents: 'all', cursor: 'grab' }}
        onPointerDown={(event) => onBendPointerDown(event, chord)}
      >
        <circle cx={handle.x} cy={handle.y * sy} r={3} fill="transparent" />
        <circle
          cx={handle.x}
          cy={handle.y * sy}
          r={1}
          fill={ACCENT}
          stroke="white"
          strokeWidth={0.3}
          style={{ pointerEvents: 'none' }}
        />
      </g>
      <g
        role="button"
        aria-label="Delete"
        transform={`translate(${deleteX} ${deleteY})`}
        style={{ pointerEvents: 'all', cursor: 'pointer' }}
        onPointerDown={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        <circle r={3} fill="transparent" />
        <circle r={1.1} fill="rgb(220 38 38)" />
        <path
          d="M-0.5 -0.5 L0.5 0.5 M-0.5 0.5 L0.5 -0.5"
          stroke="white"
          strokeWidth={0.4}
          strokeLinecap="round"
        />
      </g>
    </>
  );
}
