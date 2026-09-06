import type {
  PlacedObject,
  PlayObjectKind,
  Point,
} from '@/features/playbook/utils/diagram/types';

export const ROSTER_SIZE = 5; // slots shown per side on a fresh play
export const MAX_PER_SIDE = 7; // the "+" button stops here

const prefix = (kind: PlayObjectKind) => (kind === 'offense' ? 'o' : 'x');

export const slotId = (kind: PlayObjectKind, n: number) =>
  `${prefix(kind)}${n}`;

export const slotKind = (id: string): PlayObjectKind =>
  id.startsWith('x') ? 'defense' : 'offense';

export const slotNumber = (id: string) => Number(id.slice(1)) || 0;

// Where a benched player lands when toggled on: offense spread along the arc,
// defenders nearer the basket.
export function homePosition(kind: PlayObjectKind, n: number): Point {
  const spread = [20, 35, 50, 65, 80, 12, 88];
  const x = spread[(n - 1) % spread.length];
  return kind === 'offense' ? { x, y: 60 } : { x, y: 34 };
}

// A defender matched to an offense player: a step toward the basket.
export function manToManPosition(o: PlacedObject): Point {
  return { x: o.x, y: Math.max(0, o.y - 8) };
}

export function makeSlotObject(kind: PlayObjectKind, n: number): PlacedObject {
  return {
    id: slotId(kind, n),
    kind,
    label: String(n),
    ...homePosition(kind, n),
  };
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
