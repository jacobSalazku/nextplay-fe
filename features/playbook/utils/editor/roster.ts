import type {
  PlacedObject,
  PlayObjectKind,
  Point,
} from '@/features/playbook/utils/diagram/types';

export const ROSTER_SIZE = 5; // slots shown per side on a fresh play
export const MAX_PER_SIDE = 6; // the "+" button stops here (6 + 6 <= the BE's 12)

// The rim, in stored 0..100 space (viewBox rim is ~13.5 of 94 tall).
const RIM: Point = { x: 50, y: 14 };

// Where each position stands on an empty court — the 5-out alignment:
// 1 point, 2/3 wings, 4/5 corners. Slots past 5 get a neutral spot.
const ROLE_HOME: Record<number, Point> = {
  1: { x: 50, y: 82 },
  2: { x: 16, y: 58 },
  3: { x: 84, y: 58 },
  4: { x: 28, y: 26 },
  5: { x: 72, y: 26 },
};

const prefix = (kind: PlayObjectKind) => (kind === 'offense' ? 'o' : 'x');

export const slotId = (kind: PlayObjectKind, n: number) =>
  `${prefix(kind)}${n}`;

export const slotKind = (id: string): PlayObjectKind =>
  id.startsWith('x') ? 'defense' : 'offense';

export const slotNumber = (id: string) => Number(id.slice(1)) || 0;

const towardRim = (p: Point, t: number): Point => ({
  x: p.x + (RIM.x - p.x) * t,
  y: p.y + (RIM.y - p.y) * t,
});

// A defender guarding an attacker: a quarter of the way from the attacker
// toward the rim, so they sit between their man and the basket.
export const manToManPosition = (attacker: Point): Point =>
  towardRim(attacker, 0.25);

// The home spot for a slot on an empty court (no formation to fall back to).
export function roleHome(id: string): Point {
  const n = slotNumber(id);
  const base = ROLE_HOME[n] ?? { x: n % 2 ? 32 : 68, y: 50 };
  return slotKind(id) === 'offense' ? base : towardRim(base, 0.25);
}

export function makeSlotObject(
  kind: PlayObjectKind,
  n: number,
  at: Point = roleHome(slotId(kind, n)),
): PlacedObject {
  return { id: slotId(kind, n), kind, label: String(n), x: at.x, y: at.y };
}

// The benched roster for one side: every slot 1..count not currently on court.
export function benchForSide(
  objects: PlacedObject[],
  kind: PlayObjectKind,
  count: number,
): PlacedObject[] {
  const bench: PlacedObject[] = [];
  for (let n = 1; n <= count; n++) {
    if (!objects.some((o) => o.id === slotId(kind, n))) {
      bench.push(makeSlotObject(kind, n));
    }
  }
  return bench;
}
