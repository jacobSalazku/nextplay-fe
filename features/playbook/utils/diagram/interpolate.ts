import { actionEndpoints, bezierPoint } from './geometry';
import type { Action, Phase, PlacedObject, Point } from './types';

// The move time for a transition with no moves to time.
const DEFAULT_SEGMENT_MS = 900;
// Per-move beat when a phase has no explicit step timeline.
const DEFAULT_BEAT_MS = 700;

// Being the subject of one of these in a step puts a player on that step's beat.
const MOVE_ACTIONS: ReadonlySet<Action['type']> = new Set([
  'cut',
  'dribble',
  'screen',
]);
// A screen ends in a plant, so only these two are followed along their curve.
const PATH_ACTIONS: ReadonlySet<Action['type']> = new Set(['cut', 'dribble']);
const BALL_ACTIONS: ReadonlySet<Action['type']> = new Set(['pass', 'handoff']);

// Consecutive steps overlap by this fraction of the shorter one, so the play
// flows from one beat into the next instead of stopping between them.
const BEAT_OVERLAP = 0.4;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

// eased in and out, so a mover accelerates off the mark and settles onto its
// spot rather than snapping to a constant speed
const easeInOut = (t: number) =>
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

// Where each step's beat starts, and how long the whole transition runs. Beats
// overlap, so `total` is less than the naive sum of durations.
function beatLayout(steps: { durationMs: number }[]): {
  starts: number[];
  total: number;
} {
  const starts: number[] = [];
  let cursor = 0;
  for (let i = 0; i < steps.length; i++) {
    starts.push(cursor);
    const next = steps[i + 1];
    const overlap = next
      ? BEAT_OVERLAP * Math.min(steps[i].durationMs, next.durationMs)
      : 0;
    cursor += steps[i].durationMs - overlap;
  }
  const last = steps.length - 1;
  return {
    starts,
    total: last >= 0 ? starts[last] + steps[last].durationMs : 0,
  };
}

type Beat = { actionIds: string[]; durationMs: number };

// The step timeline the phase actually plays: its own `steps` if set, otherwise
// each move on its own beat in draw order — one after another is the default,
// grouping moves into a step runs them together.
const effectiveSteps = (from: Phase): Beat[] =>
  from.steps && from.steps.length > 0
    ? from.steps
    : from.actions.map((a) => ({
        actionIds: [a.id],
        durationMs: DEFAULT_BEAT_MS,
      }));

// How long the transition leaving `from` runs — its overlapped beats, or the
// default when there are no moves. No pause between beats or phases.
const segmentMs = (from: Phase) => {
  const beats = effectiveSteps(from);
  return beats.length > 0 ? beatLayout(beats).total : DEFAULT_SEGMENT_MS;
};

// The end state of a single phase's own actions: every mover sits at its
// drawn endpoint, the ball with whoever it was passed to. Lets a one-phase
// play still animate — there is always something to run.
function synthEndPhase(phase: Phase): Phase {
  const objects = phase.objects.map((obj) => {
    const move = phase.actions.find(
      (a) => a.fromId === obj.id && MOVE_ACTIONS.has(a.type),
    );
    const ends = move && actionEndpoints(move, phase.objects);
    return ends ? { ...obj, x: ends.b.x, y: ends.b.y } : obj;
  });

  const pass =
    phase.ballHolderId != null
      ? phase.actions.find(
          (a) =>
            a.fromId === phase.ballHolderId &&
            a.toId != null &&
            BALL_ACTIONS.has(a.type),
        )
      : undefined;

  return {
    ...phase,
    id: `${phase.id}~end`,
    objects,
    actions: [],
    ...(pass?.toId ? { ballHolderId: pass.toId } : {}),
  };
}

// Every phase plays its own actions out: the playback runs phase → (that
// phase's drawn end), phase by phase, rather than morphing one phase's setup
// into the next. The trailing synth phase gives the last real phase a segment
// of its own to animate in.
const playbackPhases = (phases: Phase[]): Phase[] => [
  ...phases,
  synthEndPhase(phases[phases.length - 1]),
];

export const animationDurationMs = (phases: Phase[]) =>
  playbackPhases(phases)
    .slice(0, -1)
    .reduce((sum, from) => sum + segmentMs(from), 0);

// The 0..1 progress at which the transition leaving phase `index` begins — the
// last phase maps to the very end.
export function phaseStartProgress(phases: Phase[], index: number): number {
  if (index <= 0) return 0;
  const durations = playbackPhases(phases).slice(0, -1).map(segmentMs);
  const total = durations.reduce((sum, d) => sum + d, 0);
  if (total === 0) return 0;
  const before = durations.slice(0, index).reduce((sum, d) => sum + d, 0);
  return Math.min(1, before / total);
}

export type FrameSlice = { fromIndex: number; toIndex: number; t: number };

// A normalised 0..1 progress across the whole play maps to a segment and a
// linear 0..1 position within it. Segments are weighted by their duration, so a
// long multi-step transition gets a proportionally wider slice of the scrubber.
export function resolveFrame(phases: Phase[], progress: number): FrameSlice {
  const seq = playbackPhases(phases);
  const durations = seq.slice(0, -1).map(segmentMs);
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
  // from-phase routes with how far each is drawn (0..1), keyed by action id —
  // a line draws itself as its beat runs
  routes: { id: string; progress: number }[];
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
  totalMs: number,
): { pre: number; d: number } {
  const steps = effectiveSteps(from);
  if (steps.length === 0) return { pre: 0, d: totalMs };

  const { starts } = beatLayout(steps);
  let found: { pre: number; d: number } | null = null;

  steps.forEach((step, i) => {
    const hit = step.actionIds.some((id) => {
      const action = from.actions.find((x) => x.id === id);
      return action != null && matches(action);
    });
    if (hit) found = { pre: starts[i], d: step.durationMs };
  });

  return found ?? { pre: 0, d: totalMs };
}

// Eased 0..1 for a mover, given how many ms into the transition we are and
// which slice of it is that mover's beat. `reduce` snaps it for minimised
// motion.
function beatProgress(
  activeMs: number,
  window: { pre: number; d: number },
  reduce: boolean,
): number {
  const local = window.d > 0 ? clamp01((activeMs - window.pre) / window.d) : 1;
  return reduce ? (local < 0.5 ? 0 : 1) : easeInOut(local);
}

export function interpolateFrame(
  phases: Phase[],
  progress: number,
  reduce = false,
): AnimationFrame {
  const seq = playbackPhases(phases);
  const { fromIndex, toIndex, t } = resolveFrame(phases, progress);
  const from = seq[fromIndex];
  const next = seq[toIndex]; // only for players joining / leaving the floor
  const end = synthEndPhase(from); // where this phase's own actions land

  const totalMs = segmentMs(from);
  const activeMs = clamp01(t) * totalMs;

  const at = (phase: Phase, id: string) =>
    phase.objects.find((o) => o.id === id) ?? null;

  const ids = new Set<string>();
  for (const o of from.objects) ids.add(o.id);
  for (const o of next.objects) ids.add(o.id);

  const objects: FrameObject[] = [];
  for (const id of ids) {
    const a = at(from, id);
    const stays = at(next, id) != null;

    if (a && !stays) {
      objects.push({ ...a, opacity: 1 - t }); // benched next phase — fade out
      continue;
    }
    if (!a) {
      const joining = at(next, id);
      if (joining) objects.push({ ...joining, opacity: t }); // fade in
      continue;
    }

    // Only players the coach gave a move to in THIS phase animate; the rest
    // hold their spot while the phase plays out.
    const moves = from.actions.some(
      (action) => action.fromId === id && MOVE_ACTIONS.has(action.type),
    );
    if (!moves) {
      objects.push({ ...a, opacity: 1 });
      continue;
    }

    const target = at(end, id) ?? a;
    const window = stepWindow(
      from,
      (action) => action.fromId === id && MOVE_ACTIONS.has(action.type),
      totalMs,
    );
    const p = beatProgress(activeMs, window, reduce);
    const path = soloPath(from, id);
    const pos = path ? followWarped(path, target, p) : lerpPoint(a, target, p);
    const facing = lerpFacing(a.facing, target.facing, p);
    objects.push({
      ...a,
      x: pos.x,
      y: pos.y,
      ...(facing == null ? null : { facing }),
      opacity: 1,
    });
  }

  const routes = from.actions.map((action) => ({
    id: action.id,
    progress: beatProgress(
      activeMs,
      stepWindow(from, (x) => x.id === action.id, totalMs),
      reduce,
    ),
  }));

  return {
    fromIndex,
    toIndex,
    t,
    objects,
    ball: ball(from, end, activeMs, totalMs, reduce, objects),
    routes,
  };
}

function ball(
  from: Phase,
  to: Phase,
  activeMs: number,
  totalMs: number,
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

  // a shot from the current holder — the ball flies to where it was aimed
  if (a != null) {
    const shot = from.actions.find(
      (action) => action.fromId === a && action.type === 'shot',
    );
    const ends = shot && actionEndpoints(shot, from.objects);
    if (shot && ends) {
      const window = stepWindow(from, (x) => x.id === shot.id, totalMs);
      return followWarped(ends, ends.b, beatProgress(activeMs, window, reduce));
    }
  }

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
      totalMs,
    );
    const p = beatProgress(activeMs, window, reduce);
    const ends = pass && actionEndpoints(pass, from.objects);
    return ends ? followWarped(ends, end, p) : lerpPoint(start, end, p);
  }

  return framePos((a ?? b)!);
}
