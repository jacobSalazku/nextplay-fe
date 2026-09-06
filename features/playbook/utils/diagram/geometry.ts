import type { Action, PlacedObject, Point } from './types';

export function bezierPoint(
  a: Point,
  b: Point,
  ctrl: Point | null,
  t: number,
): Point {
  if (!ctrl) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  const m = 1 - t;
  return {
    x: m * m * a.x + 2 * m * t * ctrl.x + t * t * b.x,
    y: m * m * a.y + 2 * m * t * ctrl.y + t * t * b.y,
  };
}

export function perpAt(
  a: Point,
  b: Point,
  ctrl: Point | null,
  t: number,
): Point {
  let dx: number;
  let dy: number;
  if (ctrl) {
    dx = 2 * (1 - t) * (ctrl.x - a.x) + 2 * t * (b.x - ctrl.x);
    dy = 2 * (1 - t) * (ctrl.y - a.y) + 2 * t * (b.y - ctrl.y);
  } else {
    dx = b.x - a.x;
    dy = b.y - a.y;
  }
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function fmt(n: number): string {
  return Number(n.toFixed(2)).toString();
}

export function routePath(
  type: Action['type'],
  a: Point,
  b: Point,
  ctrl: Point | null,
): string {
  const main = ctrl
    ? `M${fmt(a.x)} ${fmt(a.y)} Q${fmt(ctrl.x)} ${fmt(ctrl.y)} ${fmt(b.x)} ${fmt(b.y)}`
    : `M${fmt(a.x)} ${fmt(a.y)} L${fmt(b.x)} ${fmt(b.y)}`;

  if (type === 'dribble') {
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    // a tight regular squiggle: ~3.5 court-units per full wave, tapering onto
    // the straight line at the end so the arrowhead sits flush
    const waves = Math.max(3, Math.round(len / 3.5));
    const steps = waves * 10;
    const amplitude = 1.1;
    let d = `M${fmt(a.x)} ${fmt(a.y)}`;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const p = bezierPoint(a, b, ctrl, t);
      const pr = perpAt(a, b, ctrl, t);
      const taper = Math.min(1, (1 - t) / 0.15);
      const off = Math.sin(t * Math.PI * 2 * waves) * amplitude * taper;
      d += ` L${fmt(p.x + pr.x * off)} ${fmt(p.y + pr.y * off)}`;
    }
    return d;
  }

  if (type === 'screen') {
    const end = bezierPoint(a, b, ctrl, 1);
    const pr = perpAt(a, b, ctrl, 1);
    const bar = 3;
    return `${main} M${fmt(end.x + pr.x * bar)} ${fmt(end.y + pr.y * bar)} L${fmt(end.x - pr.x * bar)} ${fmt(end.y - pr.y * bar)}`;
  }

  if (type === 'handoff') {
    const mid = bezierPoint(a, b, ctrl, 0.66);
    const pr = perpAt(a, b, ctrl, 0.66);
    const tick = 2.2;
    return `${main} M${fmt(mid.x + pr.x * tick)} ${fmt(mid.y + pr.y * tick)} L${fmt(mid.x - pr.x * tick)} ${fmt(mid.y - pr.y * tick)}`;
  }

  return main;
}

// The straight endpoints of an action in the coord space of `objects`, or null
// if an endpoint is missing. `from` is the source token; `to` is the target
// token or the free `toPoint`.
export function actionChord(
  action: Pick<Action, 'fromId' | 'toId' | 'toPoint'>,
  objects: PlacedObject[],
): { from: Point; to: Point } | null {
  const from = objects.find((o) => o.id === action.fromId);
  if (!from) return null;

  const target =
    action.toId != null
      ? objects.find((o) => o.id === action.toId)
      : action.toPoint;
  if (!target) return null;

  return { from: { x: from.x, y: from.y }, to: { x: target.x, y: target.y } };
}

export function actionEndpoints(
  action: Action,
  objects: PlacedObject[],
): { a: Point; b: Point; ctrl: Point | null } | null {
  const chord = actionChord(action, objects);
  if (!chord) return null;

  const { from: a, to: b } = chord;
  // `bend` is an offset from the midpoint of the straight a->b line, so the
  // curve follows when an endpoint moves. Absent / zero == straight.
  const bent = action.bend && (action.bend.x !== 0 || action.bend.y !== 0);
  const ctrl = bent
    ? {
        x: (a.x + b.x) / 2 + action.bend!.x,
        y: (a.y + b.y) / 2 + action.bend!.y,
      }
    : null;

  return { a, b, ctrl };
}

export const ARROW_ACTIONS: ReadonlySet<Action['type']> = new Set([
  'pass',
  'cut',
  'dribble',
  'shot',
  'handoff',
]);
