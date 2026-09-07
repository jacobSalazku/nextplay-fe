import { actionEndpoints, bezierPoint } from './geometry';
import type { Action, Phase, PlacedObject, Point } from './types';

// Front slice of every segment where players hold the 'from' pose before moving,
// so the eye registers each keyframe. The rest of the segment is the move.
export const HOLD_FRACTION = 0.22;

const MOVE_MS = 900;
const HOLD_MS = 260;
export const SEGMENT_MS = MOVE_MS + HOLD_MS;

// Only these drag a player along their drawn curve; a screen ends in a hold, and
// pass / shot / handoff move the ball, not a body.
const PATH_ACTIONS: ReadonlySet<Action['type']> = new Set(['cut', 'dribble']);
const BALL_ACTIONS: ReadonlySet<Action['type']> = new Set(['pass', 'handoff']);

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});

// shortest way round the circle, in degrees
export const lerpAngle = (a: number, b: number, t: number) => {
  const d = ((((b - a) % 360) + 540) % 360) - 180;
  return a + d * t;
};

export const animationDurationMs = (phaseCount: number) =>
  Math.max(0, phaseCount - 1) * SEGMENT_MS;

export type FrameSlice = { fromIndex: number; toIndex: number; t: number };

// A normalised 0..1 progress across the whole play maps to a segment plus an
// eased position within it (0 during that segment's hold, then eased 0..1).
// `reduce` snaps that to 0 or 1 — a slideshow of keyframes for viewers who
// asked the OS to minimise motion.
export function resolveFrame(
  phaseCount: number,
  progress: number,
  reduce = false,
): FrameSlice {
  if (phaseCount < 2) return { fromIndex: 0, toIndex: 0, t: 0 };

  const segments = phaseCount - 1;
  const scaled = clamp01(progress) * segments;
  const seg = Math.min(segments - 1, Math.floor(scaled));
  const local = scaled - seg;
  const moved =
    local <= HOLD_FRACTION ? 0 : (local - HOLD_FRACTION) / (1 - HOLD_FRACTION);

  return {
    fromIndex: seg,
    toIndex: seg + 1,
    t: reduce ? (moved < 0.5 ? 0 : 1) : easeInOutCubic(clamp01(moved)),
  };
}

export type FrameObject = PlacedObject & { opacity: number };

export type AnimationFrame = {
  fromIndex: number;
  toIndex: number;
  t: number;
  objects: FrameObject[];
  ball: Point | null;
};

type Ends = { a: Point; b: Point; ctrl: Point | null };

// The single cut / dribble drawn from `id` in `phase`, or null when there is
// none or more than one (ambiguous — fall back to a straight move).
function soloMovement(phase: Phase, id: string): Ends | null {
  const hits = phase.actions.filter(
    (action) => action.fromId === id && PATH_ACTIONS.has(action.type),
  );
  return hits.length === 1 ? actionEndpoints(hits[0], phase.objects) : null;
}

// Follow the drawn curve, but ramp a correction over the move so the mover ends
// exactly on `end` even when the coach's arrow stopped somewhere else.
function followWarped(ends: Ends, end: Point, t: number): Point {
  const raw = bezierPoint(ends.a, ends.b, ends.ctrl, t);
  return {
    x: raw.x + (end.x - ends.b.x) * t,
    y: raw.y + (end.y - ends.b.y) * t,
  };
}

function lerpFacing(a?: number, b?: number, t = 0): number | undefined {
  if (a == null && b == null) return undefined;
  return lerpAngle(a ?? b!, b ?? a!, t);
}

export function interpolateFrame(
  phases: Phase[],
  progress: number,
  reduce = false,
): AnimationFrame {
  const { fromIndex, toIndex, t } = resolveFrame(
    phases.length,
    progress,
    reduce,
  );
  const from = phases[fromIndex];
  const to = phases[toIndex];

  const at = (phase: Phase, id: string) =>
    phase.objects.find((o) => o.id === id) ?? null;

  const ids = new Set<string>();
  for (const o of from.objects) ids.add(o.id);
  for (const o of to.objects) ids.add(o.id);

  const objects: FrameObject[] = [];
  for (const id of ids) {
    const a = at(from, id);
    const b = at(to, id);

    if (a && b) {
      const path = soloMovement(from, id);
      const pos = path ? followWarped(path, b, t) : lerpPoint(a, b, t);
      const facing = lerpFacing(a.facing, b.facing, t);
      objects.push({
        ...a,
        x: pos.x,
        y: pos.y,
        ...(facing == null ? null : { facing }),
        opacity: 1,
      });
    } else if (a) {
      objects.push({ ...a, opacity: 1 - t });
    } else if (b) {
      objects.push({ ...b, opacity: t });
    }
  }

  return { fromIndex, toIndex, t, objects, ball: ball(from, to, t, objects) };
}

function ball(
  from: Phase,
  to: Phase,
  t: number,
  objects: FrameObject[],
): Point | null {
  const a = from.ballHolderId;
  const b = to.ballHolderId;
  if (a == null && b == null) return null;

  const framePos = (id: string): Point | null => {
    const o = objects.find((ob) => ob.id === id);
    return o ? { x: o.x, y: o.y } : null;
  };

  if (a != null && a === b) return framePos(a);

  if (a != null && b != null) {
    const start = from.objects.find((o) => o.id === a);
    const end = to.objects.find((o) => o.id === b);
    if (!start || !end) return framePos(a) ?? framePos(b);

    const pass = from.actions.find(
      (action) =>
        action.fromId === a &&
        action.toId === b &&
        BALL_ACTIONS.has(action.type),
    );
    const ends = pass && actionEndpoints(pass, from.objects);
    return ends ? followWarped(ends, end, t) : lerpPoint(start, end, t);
  }

  return framePos((a ?? b)!);
}
