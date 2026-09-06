export const MAX_PHASES = 15;

// Which slot a pointer at `clientX` is over, given the thumbnails' horizontal
// screen bounds in order. Used to pick the drop index while dragging a phase.
export function phaseIndexAtX(
  bounds: { left: number; right: number }[],
  clientX: number,
): number {
  for (let i = 0; i < bounds.length; i++) {
    const mid = (bounds[i].left + bounds[i].right) / 2;
    if (clientX < mid) return i;
  }
  return Math.max(0, bounds.length - 1);
}
