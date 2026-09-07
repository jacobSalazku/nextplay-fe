import {
  animationDurationMs,
  easeInOutCubic,
  interpolateFrame,
  lerpAngle,
  phaseStartProgress,
  resolveFrame,
} from '@/features/playbook/utils/diagram/interpolate';
import type {
  Phase,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import { describe, expect, it } from 'vitest';

const phase = (id: string, over: Partial<Phase> = {}): Phase => ({
  id,
  objects: [],
  actions: [],
  ...over,
});

const obj = (id: string, x: number, y = 0): PlacedObject => ({
  id,
  kind: 'offense',
  label: id.slice(-1),
  x,
  y,
});

describe('resolveFrame', () => {
  it('parks on the only phase when there is nothing to move between', () => {
    expect(resolveFrame([phase('p1')], 0.5)).toEqual({
      fromIndex: 0,
      toIndex: 0,
      t: 0,
    });
  });

  it('walks the segments as progress advances', () => {
    const ph = [phase('p1'), phase('p2'), phase('p3')];

    expect(resolveFrame(ph, 0.25)).toMatchObject({ fromIndex: 0, toIndex: 1 });
    expect(resolveFrame(ph, 0.75)).toMatchObject({ fromIndex: 1, toIndex: 2 });
  });

  it('clamps to the last segment at and past progress 1', () => {
    const ph = [phase('p1'), phase('p2'), phase('p3'), phase('p4')];

    expect(resolveFrame(ph, 1)).toEqual({ fromIndex: 2, toIndex: 3, t: 1 });
    expect(resolveFrame(ph, 2)).toEqual({ fromIndex: 2, toIndex: 3, t: 1 });
  });

  it('reports where each phase starts on the scrubber', () => {
    const ph = [phase('p1'), phase('p2'), phase('p3')];

    expect(phaseStartProgress(ph, 0)).toBe(0);
    expect(phaseStartProgress(ph, 1)).toBeCloseTo(0.5);
    expect(phaseStartProgress(ph, 2)).toBe(1); // last phase → the end
  });

  it('gives a long multi-step transition a wider slice of the scrubber', () => {
    const ph = [
      phase('p1', {
        actions: [
          { id: 'a1', type: 'cut', fromId: 'o1', toPoint: { x: 1, y: 1 } },
        ],
        steps: [{ id: 's1', actionIds: ['a1'], durationMs: 4000 }],
      }),
      phase('p2'),
      phase('p3'),
    ];

    // halfway through the scrubber is still inside the first, long transition
    expect(resolveFrame(ph, 0.5).fromIndex).toBe(0);
  });
});

describe('animationDurationMs', () => {
  it('is zero for one phase and scales with the segment count', () => {
    expect(animationDurationMs([phase('p1')])).toBe(0);

    const one = animationDurationMs([phase('p1'), phase('p2')]);
    const two = animationDurationMs([phase('p1'), phase('p2'), phase('p3')]);
    expect(two).toBe(one * 2);
  });

  it("counts a phase's step durations", () => {
    const plain = animationDurationMs([phase('p1'), phase('p2')]);
    const scripted = animationDurationMs([
      phase('p1', {
        actions: [
          { id: 'a1', type: 'cut', fromId: 'o1', toPoint: { x: 1, y: 1 } },
        ],
        steps: [{ id: 's1', actionIds: ['a1'], durationMs: 5000 }],
      }),
      phase('p2'),
    ]);

    expect(scripted).toBeGreaterThan(plain + 4000);
  });
});

describe('lerpAngle', () => {
  it('takes the short way across the 0 / 360 seam', () => {
    expect(lerpAngle(350, 10, 0.5)).toBeCloseTo(360);
    expect(lerpAngle(10, 350, 0.5)).toBeCloseTo(0);
  });
});

describe('easeInOutCubic', () => {
  it('is pinned at the ends and passes through the middle', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
});

describe('interpolateFrame', () => {
  const from = phase('p1', { objects: [obj('o1', 0), obj('o2', 100)] });
  const to = phase('p2', { objects: [obj('o1', 40), obj('o2', 100)] });

  const o1At = (progress: number, reduce = false) =>
    interpolateFrame([from, to], progress, reduce).objects.find(
      (o) => o.id === 'o1',
    )!;

  it('holds at the start, moves through the middle, lands exactly at the end', () => {
    expect(o1At(0).x).toBe(0);

    const mid = o1At(0.5).x;
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(40);

    expect(o1At(1)).toMatchObject({ x: 40, y: 0 });
  });

  it('follows a drawn cut and still ends on the target', () => {
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

    const mid = interpolateFrame([curved, to], 0.6).objects.find(
      (o) => o.id === 'o1',
    )!;
    expect(mid.y).toBeGreaterThan(1); // bowed off the straight line

    expect(
      interpolateFrame([curved, to], 1).objects.find((o) => o.id === 'o1'),
    ).toMatchObject({ x: 40, y: 0 });
  });

  it('sequences steps: a mover scripted late waits its turn', () => {
    const a = phase('p1', {
      objects: [obj('o1', 0), obj('o2', 0, 50)],
      actions: [
        { id: 'a1', type: 'cut', fromId: 'o1', toPoint: { x: 40, y: 0 } },
        { id: 'a2', type: 'cut', fromId: 'o2', toPoint: { x: 40, y: 50 } },
      ],
      steps: [
        { id: 's1', actionIds: ['a1'], durationMs: 1000 },
        { id: 's2', actionIds: ['a2'], durationMs: 1000 },
      ],
    });
    const b = phase('p2', { objects: [obj('o1', 40), obj('o2', 40, 50)] });

    // into step 1, before step 2
    const early = interpolateFrame([a, b], 0.35);
    expect(early.objects.find((o) => o.id === 'o1')!.x).toBeGreaterThan(0);
    expect(early.objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 0,
      y: 50,
    });

    // the end: both landed
    const done = interpolateFrame([a, b], 1);
    expect(done.objects.find((o) => o.id === 'o1')).toMatchObject({ x: 40 });
    expect(done.objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 40,
      y: 50,
    });
  });

  it('snaps a mover to the ends under reduced motion', () => {
    expect([0, 40]).toContain(o1At(0.5, true).x);
    expect([0, 40]).toContain(o1At(0.9, true).x);
  });

  it('still cross-fades a benched player under reduced motion', () => {
    const gone = phase('p2', { objects: [obj('o2', 100)] });
    const o1 = interpolateFrame([from, gone], 0.5, true).objects.find(
      (o) => o.id === 'o1',
    )!;

    expect(o1.opacity).toBeGreaterThan(0);
    expect(o1.opacity).toBeLessThan(1);
  });

  it('fades a benched player out and a new one in', () => {
    const gone = phase('p2', { objects: [obj('o2', 100)] });
    const added = phase('p2', {
      objects: [...to.objects, obj('x1', 50, 50)],
    });

    expect(
      interpolateFrame([from, gone], 1).objects.find((o) => o.id === 'o1')!
        .opacity,
    ).toBeCloseTo(0);
    expect(
      interpolateFrame([from, added], 0).objects.find((o) => o.id === 'x1')!
        .opacity,
    ).toBeCloseTo(0);
  });

  it('keeps the ball on a holder that does not change', () => {
    const a = phase('p1', { objects: from.objects, ballHolderId: 'o1' });
    const b = phase('p2', { objects: to.objects, ballHolderId: 'o1' });

    expect(interpolateFrame([a, b], 1).ball).toEqual({ x: 40, y: 0 });
  });

  it('carries the ball from passer to receiver when possession changes', () => {
    const a = phase('p1', { objects: from.objects, ballHolderId: 'o1' });
    const b = phase('p2', { objects: to.objects, ballHolderId: 'o2' });

    expect(interpolateFrame([a, b], 0.35).ball!.x).toBeLessThan(50);
    expect(interpolateFrame([a, b], 1).ball).toEqual({ x: 100, y: 0 });
  });

  it('has no ball when nobody holds it', () => {
    expect(interpolateFrame([from, to], 0.5).ball).toBeNull();
  });
});
