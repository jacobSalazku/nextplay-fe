export const MAX_PHASES = 15;

// Which slot a pointer coordinate falls into, given each slot's [start, end]
// along the drag axis, in order. Used to pick the drop index while dragging a
// phase to reorder it.
export function phaseIndexAt(
  bounds: { start: number; end: number }[],
  coord: number,
): number {
  for (let i = 0; i < bounds.length; i++) {
    if (coord < (bounds[i].start + bounds[i].end) / 2) return i;
  }
  return Math.max(0, bounds.length - 1);
}
