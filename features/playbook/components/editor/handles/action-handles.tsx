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
import { DeleteControl } from './delete-control';

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
      <DeleteControl
        x={handle.x + 3}
        y={handle.y * sy - 3}
        onDelete={onDelete}
      />
    </>
  );
}
