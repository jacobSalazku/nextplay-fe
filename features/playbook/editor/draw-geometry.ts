import type {
  Action,
  PlacedObject,
  Point,
} from '@/features/playbook/diagram/types';

// Drop the bend and treat the route as straight for editor hit-testing.
export function actionChord(
  action: Pick<Action, 'fromId' | 'toId' | 'toPoint'>,
  objects: PlacedObject[],
): { from: Point; to: Point } | null {
  const from = objects.find((o) => o.id === action.fromId);
  if (!from) return null;

  const to =
    action.toId != null
      ? objects.find((o) => o.id === action.toId)
      : action.toPoint;
  if (!to) return null;

  return { from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } };
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// Where the draggable bend handle sits: the chord midpoint plus the stored
// offset. null when an endpoint is missing.
export function bendHandle(
  action: Action,
  objects: PlacedObject[],
): Point | null {
  const chord = actionChord(action, objects);
  if (!chord) return null;

  const mid = midpoint(chord.from, chord.to);
  return { x: mid.x + (action.bend?.x ?? 0), y: mid.y + (action.bend?.y ?? 0) };
}

const STRAIGHT_SNAP = 3;

// The bend offset for a handle dropped at `point`; null when it is close enough
// to the chord midpoint to count as straight.
export function bendOffset(
  chord: { from: Point; to: Point },
  point: Point,
): Point | null {
  const mid = midpoint(chord.from, chord.to);
  const offset = { x: point.x - mid.x, y: point.y - mid.y };
  return Math.hypot(offset.x, offset.y) < STRAIGHT_SNAP ? null : offset;
}

// The nearest token to `point` within `radius`, for snapping a drawn action's
// endpoint onto a player. `excludeId` skips the token being drawn from.
export function nearestToken(
  point: Point,
  objects: PlacedObject[],
  radius: number,
  excludeId?: string,
): PlacedObject | null {
  let best: PlacedObject | null = null;
  let bestDist = radius;

  for (const o of objects) {
    if (o.id === excludeId) continue;
    const d = Math.hypot(o.x - point.x, o.y - point.y);
    if (d <= bestDist) {
      best = o;
      bestDist = d;
    }
  }
  return best;
}

// Degrees from `from` to `to` — for the defender rotation handle.
export function angleTo(from: Point, to: Point): number {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}
