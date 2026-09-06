import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import { ACCENT } from '@/features/playbook/utils/editor/colors';

const ROTATE_ARM = 9; // court units — handle distance from the token
const rad = (deg: number) => (deg * Math.PI) / 180;

// The rotate handle shown on a selected defender.
export function RotationHandle({
  object,
  sy,
  onPointerDown,
}: {
  object: PlacedObject;
  sy: number;
  onPointerDown: (event: React.PointerEvent) => void;
}) {
  const facing = object.facing ?? 0;
  const hx = object.x + Math.cos(rad(facing)) * ROTATE_ARM;
  const hy = object.y + Math.sin(rad(facing)) * ROTATE_ARM;

  return (
    <>
      <line
        x1={object.x}
        y1={object.y * sy}
        x2={hx}
        y2={hy * sy}
        stroke={ACCENT}
        strokeWidth={0.4}
      />
      <g
        role="button"
        aria-label="Rotate defender"
        style={{ pointerEvents: 'all', cursor: 'grab' }}
        onPointerDown={onPointerDown}
      >
        <circle cx={hx} cy={hy * sy} r={2.6} fill="transparent" />
        <circle
          cx={hx}
          cy={hy * sy}
          r={1.2}
          fill={ACCENT}
          stroke="white"
          strokeWidth={0.3}
          style={{ pointerEvents: 'none' }}
        />
      </g>
    </>
  );
}
