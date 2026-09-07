import { actionEndpoints, bezierPoint } from './geometry';
import type { Action, Phase, PlacedObject, Point } from './types';

// Every transition opens with a short hold on the 'from' pose so the eye
// registers the keyframe, then the move plays out.
const HOLD_MS = 280;
// The move time for a transition with no explicit step timeline.
const DEFAULT_MOVE_MS = 820;

// Being the subject of one of these in a step puts a player on that step's beat.
const MOVE_ACTIONS: ReadonlySet<Action['type']> = new Set([
  'cut',
  'dribble',
  'screen',
]);
// A screen ends in a plant, so only these two are followed along their curve.
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

// The move time of the transition leaving `from` — the sum of its step
// durations, or the default when it has no timeline.
const segmentMoveMs = (from: Phase) =>
  from.steps && from.steps.length > 0
    ? from.steps.reduce((sum, s) => sum + s.durationMs, 0)
    : DEFAULT_MOVE_MS;

const segmentDurationMs = (from: Phase) => HOLD_MS + segmentMoveMs(from);

export const animationDurationMs = (phases: Phase[]) =>
  phases.slice(0, -1).reduce((sum, from) => sum + segmentDurationMs(from), 0);

export type FrameSlice = { fromIndex: number; toIndex: number; t: number };

// A normalised 0..1 progress across the whole play maps to a segment and a
// linear 0..1 position within it. Segments are weighted by their duration, so a
// long multi-step transition gets a proportionally wider slice of the scrubber.
export function resolveFrame(phases: Phase[], progress: number): FrameSlice {
  if (phases.length < 2) return { fromIndex: 0, toIndex: 0, t: 0 };

  const durations = phases.slice(0, -1).map(segmentDurationMs);
  const total = durations.reduce((sum, d) => sum + d, 0);
  const target = clamp01(progress) * total;

  let acc = 0;
  for (let i = 0; i < durations.length; i++) {
    const last = i === durations.length - 1;
    if (target <= acc + durations[i] || last) {
      const local = durations[i] > 0 ? (target - acc) / durations[i] : 1;
      return { fromIndex: i, toIndex: i + 1, t: clamp01(local) };
    }
    acc += durations[i];
  }
  return { fromIndex: 0, toIndex: 1, t: 0 };
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
function soloPath(phase: Phase, id: string): Ends | null {
  const hits = phase.actions.filter(
    (action) => action.fromId === id && PATH_ACTIONS.has(action.type),
  );
  return hits.length === 1 ? actionEndpoints(hits[0], phase.objects) : null;
}

// Follow the drawn curve, ramping a correction over the move so the mover ends
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

// When in the move sequence an action (or an object's move) runs. Walks the
// steps; the last one matching wins (a mover scripted late holds until then).
// Unscripted movement fills the whole window.
function stepWindow(
  from: Phase,
  matches: (action: Action) => boolean,
  moveMs: number,
): { pre: number; d: number } {
  let pre = 0;
  let found: { pre: number; d: number } | null = null;

  for (const step of from.steps ?? []) {
    const hit = step.actionIds.some((id) => {
      const action = from.actions.find((x) => x.id === id);
      return action != null && matches(action);
    });
    if (hit) found = { pre, d: step.durationMs };
    pre += step.durationMs;
  }

  return found ?? { pre: 0, d: moveMs };
}

// Eased 0..1 for a mover, given how many ms into the move sequence we are and
// which slice of it belongs to that mover. `reduce` snaps it for minimised
// motion.
function beatProgress(
  activeMs: number,
  window: { pre: number; d: number },
  reduce: boolean,
): number {
  const local = window.d > 0 ? clamp01((activeMs - window.pre) / window.d) : 1;
  if (reduce) return local < 0.5 ? 0 : 1;
  return easeInOutCubic(local);
}

export function interpolateFrame(
  phases: Phase[],
  progress: number,
  reduce = false,
): AnimationFrame {
  const { fromIndex, toIndex, t } = resolveFrame(phases, progress);
  const from = phases[fromIndex];
  const to = phases[toIndex];

  const moveMs = segmentMoveMs(from);
  // ms into the move sequence: the leading hold is spent first
  const activeMs = Math.min(
    moveMs,
    Math.max(0, t * segmentDurationMs(from) - HOLD_MS),
  );

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
      const window = stepWindow(
        from,
        (action) => action.fromId === id && MOVE_ACTIONS.has(action.type),
        moveMs,
      );
      const p = beatProgress(activeMs, window, reduce);
      const path = soloPath(from, id);
      const pos = path ? followWarped(path, b, p) : lerpPoint(a, b, p);
      const facing = lerpFacing(a.facing, b.facing, p);
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

  return {
    fromIndex,
    toIndex,
    t,
    objects,
    ball: ball(from, to, activeMs, moveMs, reduce, objects),
  };
}

function ball(
  from: Phase,
  to: Phase,
  activeMs: number,
  moveMs: number,
  reduce: boolean,
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
    const window = stepWindow(
      from,
      (action) => pass != null && action.id === pass.id,
      moveMs,
    );
    const p = beatProgress(activeMs, window, reduce);
    const ends = pass && actionEndpoints(pass, from.objects);
    return ends ? followWarped(ends, end, p) : lerpPoint(start, end, p);
  }

  return framePos((a ?? b)!);
}
