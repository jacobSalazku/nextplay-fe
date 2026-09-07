import {
  animationDurationMs,
  HOLD_FRACTION,
  interpolateFrame,
  lerpAngle,
  resolveFrame,
} from '@/features/playbook/utils/diagram/interpolate';
import type { Phase } from '@/features/playbook/utils/diagram/types';
import { describe, expect, it } from 'vitest';

const phase = (id: string, over: Partial<Phase> = {}): Phase => ({
  id,
  objects: [],
  actions: [],
  ...over,
});

describe('resolveFrame', () => {
  it('parks on the only phase when there is nothing to move between', () => {
    expect(resolveFrame(1, 0.5)).toEqual({ fromIndex: 0, toIndex: 0, t: 0 });
  });

  it('holds at the start of a segment, then eases to the next phase', () => {
    // Arrange — 3 phases => 2 segments; progress 0.5 is the seam
    const hold = resolveFrame(3, HOLD_FRACTION / 2 / 2);
    const mid = resolveFrame(3, 0.25);
    const seam = resolveFrame(3, 0.5);

    // Assert
    expect(hold).toMatchObject({ fromIndex: 0, toIndex: 1, t: 0 });
    expect(mid.fromIndex).toBe(0);
    expect(mid.t).toBeGreaterThan(0);
    expect(seam).toMatchObject({ fromIndex: 1, toIndex: 2 });
  });

  it('clamps to the last phase at and past progress 1', () => {
    expect(resolveFrame(4, 1)).toEqual({ fromIndex: 2, toIndex: 3, t: 1 });
    expect(resolveFrame(4, 2)).toEqual({ fromIndex: 2, toIndex: 3, t: 1 });
  });

  it('snaps t to 0 or 1 when motion is reduced', () => {
    // 3 phases => 2 segments; progress 0.45 is deep into the first move
    expect(resolveFrame(3, 0.1, true).t).toBe(0);
    expect(resolveFrame(3, 0.45, true).t).toBe(1);

    const eased = resolveFrame(3, 0.45, false).t;
    expect(eased).toBeGreaterThan(0);
    expect(eased).toBeLessThan(1);
  });
});

describe('animationDurationMs', () => {
  it('is zero for a single phase and scales with the segment count', () => {
    expect(animationDurationMs(1)).toBe(0);
    expect(animationDurationMs(3)).toBe(animationDurationMs(2) * 2);
  });
});

describe('lerpAngle', () => {
  it('takes the short way across the 0/360 seam', () => {
    expect(lerpAngle(350, 10, 0.5)).toBeCloseTo(360);
    expect(lerpAngle(10, 350, 0.5)).toBeCloseTo(0);
  });
});

describe('interpolateFrame', () => {
  const from = phase('p1', {
    objects: [
      { id: 'o1', kind: 'offense', label: '1', x: 0, y: 0 },
      { id: 'o2', kind: 'offense', label: '2', x: 100, y: 0 },
    ],
  });
  const to = phase('p2', {
    objects: [
      { id: 'o1', kind: 'offense', label: '1', x: 40, y: 0 },
      { id: 'o2', kind: 'offense', label: '2', x: 100, y: 0 },
    ],
  });

  it('moves a player in a straight line when nothing was drawn', () => {
    // Act — t is eased, so aim at the segment midpoint (t ~= 0.5)
    const frame = interpolateFrame(
      [from, to],
      HOLD_FRACTION + (1 - HOLD_FRACTION) / 2,
    );
    const o1 = frame.objects.find((o) => o.id === 'o1')!;

    // Assert — somewhere between the two x positions, y unchanged
    expect(o1.x).toBeGreaterThan(0);
    expect(o1.x).toBeLessThan(40);
    expect(o1.y).toBe(0);
    expect(o1.opacity).toBe(1);
  });

  it('lands every mover exactly on the target at t = 1', () => {
    const frame = interpolateFrame([from, to], 1);
    expect(frame.objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 40,
      y: 0,
    });
  });

  it('follows a drawn cut and still ends on the target', () => {
    // Arrange — a cut that bows downward, ending short of the real target
    const curved = phase('p1', {
      objects: from.objects,
      actions: [
        {
          id: 'a1',
          type: 'cut',
          fromId: 'o1',
          toPoint: { x: 30, y: 0 },
          bend: { x: 0, y: 20 },
        },
      ],
    });

    // Act
    const half = interpolateFrame(
      [curved, to],
      0.5 * (1 - HOLD_FRACTION) + HOLD_FRACTION,
    );
    const end = interpolateFrame([curved, to], 1);
    const o1half = half.objects.find((o) => o.id === 'o1')!;

    // Assert — bowed off the straight line mid-move, exact at the end
    expect(o1half.y).toBeGreaterThan(1);
    expect(end.objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 40,
      y: 0,
    });
  });

  it('fades a benched player out and a new one in across the segment', () => {
    const gone = phase('p2', { objects: [to.objects[1]] });
    const added = phase('p2', {
      objects: [
        ...to.objects,
        { id: 'x1', kind: 'defense', label: 'x1', x: 50, y: 50 },
      ],
    });

    const leaving = interpolateFrame([from, gone], 1);
    const arriving = interpolateFrame([from, added], HOLD_FRACTION);

    expect(leaving.objects.find((o) => o.id === 'o1')!.opacity).toBeCloseTo(0);
    expect(arriving.objects.find((o) => o.id === 'x1')!.opacity).toBeCloseTo(0);
  });

  it('keeps the ball on a holder that does not change', () => {
    const a = phase('p1', { objects: from.objects, ballHolderId: 'o1' });
    const b = phase('p2', { objects: to.objects, ballHolderId: 'o1' });

    const frame = interpolateFrame([a, b], 1);
    expect(frame.ball).toEqual({ x: 40, y: 0 });
  });

  it('carries the ball from passer to receiver when possession changes', () => {
    const a = phase('p1', { objects: from.objects, ballHolderId: 'o1' });
    const b = phase('p2', { objects: to.objects, ballHolderId: 'o2' });

    const start = interpolateFrame([a, b], HOLD_FRACTION);
    const done = interpolateFrame([a, b], 1);

    expect(start.ball!.x).toBeCloseTo(0);
    expect(done.ball).toEqual({ x: 100, y: 0 });
  });

  it('has no ball when nobody holds it', () => {
    expect(interpolateFrame([from, to], 0.5).ball).toBeNull();
  });
});
