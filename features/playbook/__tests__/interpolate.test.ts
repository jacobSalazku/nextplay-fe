import {
  animationDurationMs,
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
  it('animates a single phase against its own end state', () => {
    const one = [
      phase('p1', {
        objects: [obj('o1', 0)],
        actions: [
          { id: 'a1', type: 'cut', fromId: 'o1', toPoint: { x: 40, y: 0 } },
        ],
      }),
    ];

    expect(resolveFrame(one, 0.5)).toMatchObject({ fromIndex: 0, toIndex: 1 });

    // the mover ends on its drawn endpoint
    const end = interpolateFrame(one, 1).objects.find((o) => o.id === 'o1');
    expect(end).toMatchObject({ x: 40, y: 0 });
  });

  it('a one-phase play with no moves just holds still', () => {
    const one = [phase('p1', { objects: [obj('o1', 25)] })];
    const start = interpolateFrame(one, 0).objects.find((o) => o.id === 'o1');
    const later = interpolateFrame(one, 1).objects.find((o) => o.id === 'o1');
    expect(start).toMatchObject({ x: 25 });
    expect(later).toMatchObject({ x: 25 });
  });

  it('walks a segment per phase as progress advances', () => {
    const ph = [phase('p1'), phase('p2'), phase('p3')];

    expect(resolveFrame(ph, 0.16)).toMatchObject({ fromIndex: 0, toIndex: 1 });
    expect(resolveFrame(ph, 0.5)).toMatchObject({ fromIndex: 1, toIndex: 2 });
    expect(resolveFrame(ph, 0.83)).toMatchObject({ fromIndex: 2, toIndex: 3 });
  });

  it('clamps to the last phase at and past progress 1', () => {
    const ph = [phase('p1'), phase('p2'), phase('p3'), phase('p4')];

    expect(resolveFrame(ph, 1)).toEqual({ fromIndex: 3, toIndex: 4, t: 1 });
    expect(resolveFrame(ph, 2)).toEqual({ fromIndex: 3, toIndex: 4, t: 1 });
  });

  it('reports where each phase starts on the scrubber', () => {
    const ph = [phase('p1'), phase('p2'), phase('p3')];

    expect(phaseStartProgress(ph, 0)).toBe(0);
    expect(phaseStartProgress(ph, 1)).toBeCloseTo(1 / 3);
    expect(phaseStartProgress(ph, 2)).toBeCloseTo(2 / 3);
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
  it('gives every phase a segment of its own', () => {
    const one = animationDurationMs([phase('p1')]);
    expect(one).toBeGreaterThan(0);

    expect(animationDurationMs([phase('p1'), phase('p2')])).toBe(one * 2);
    expect(animationDurationMs([phase('p1'), phase('p2'), phase('p3')])).toBe(
      one * 3,
    );
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

  it('overlaps consecutive steps, so a second step adds less than its length', () => {
    const cut = (id: string, from: string) =>
      ({ id, type: 'cut', fromId: from, toPoint: { x: 1, y: 1 } }) as const;

    const oneStep = animationDurationMs([
      phase('p1', {
        actions: [cut('a1', 'o1')],
        steps: [{ id: 's1', actionIds: ['a1'], durationMs: 1000 }],
      }),
      phase('p2'),
    ]);
    const twoStep = animationDurationMs([
      phase('p1', {
        actions: [cut('a1', 'o1'), cut('a2', 'o2')],
        steps: [
          { id: 's1', actionIds: ['a1'], durationMs: 1000 },
          { id: 's2', actionIds: ['a2'], durationMs: 1000 },
        ],
      }),
      phase('p2'),
    ]);

    expect(twoStep - oneStep).toBeGreaterThan(0);
    expect(twoStep - oneStep).toBeLessThan(1000);
  });
});

describe('lerpAngle', () => {
  it('takes the short way across the 0 / 360 seam', () => {
    expect(lerpAngle(350, 10, 0.5)).toBeCloseTo(360);
    expect(lerpAngle(10, 350, 0.5)).toBeCloseTo(0);
  });
});

describe('interpolateFrame', () => {
  // one phase: o1 is given a cut, o2 just stands there. Its own segment spans
  // the whole scrubber.
  const solo = phase('p1', {
    objects: [obj('o1', 0), obj('o2', 100)],
    actions: [
      { id: 'm1', type: 'cut', fromId: 'o1', toPoint: { x: 40, y: 0 } },
    ],
  });

  const o1At = (progress: number, reduce = false) =>
    interpolateFrame([solo], progress, reduce).objects.find(
      (o) => o.id === 'o1',
    )!;

  it('eases the mover in and out and lands on its drawn endpoint', () => {
    expect(o1At(0).x).toBe(0);
    expect(o1At(0.25).x).toBeLessThan(10); // slow off the mark
    expect(o1At(0.5).x).toBeCloseTo(20); // halfway at the midpoint
    expect(o1At(0.75).x).toBeGreaterThan(30); // fast through the middle
    expect(o1At(1)).toMatchObject({ x: 40, y: 0 });
  });

  it('leaves a player with no move in this phase where they stand', () => {
    const o2 = interpolateFrame([solo], 0.3).objects.find(
      (o) => o.id === 'o2',
    )!;
    expect(o2).toMatchObject({ x: 100, y: 0 });
  });

  it('follows a drawn cut, bowing off the straight line', () => {
    const curved = phase('p1', {
      objects: [obj('o1', 0), obj('o2', 100)],
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

    const mid = interpolateFrame([curved], 0.6).objects.find(
      (o) => o.id === 'o1',
    )!;
    expect(mid.y).toBeGreaterThan(1); // bowed off the straight line

    // lands on the route's own endpoint
    expect(
      interpolateFrame([curved], 1).objects.find((o) => o.id === 'o1'),
    ).toMatchObject({ x: 30, y: 0 });
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

    // into step 1, before step 2
    const early = interpolateFrame([a], 0.15);
    expect(early.objects.find((o) => o.id === 'o1')!.x).toBeGreaterThan(0);
    expect(early.objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 0,
      y: 50,
    });

    // the end: both landed on their endpoints
    const done = interpolateFrame([a], 1);
    expect(done.objects.find((o) => o.id === 'o1')).toMatchObject({ x: 40 });
    expect(done.objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 40,
      y: 50,
    });
  });

  it('snaps a mover to the ends under reduced motion', () => {
    expect(o1At(0.3, true).x).toBe(0);
    expect(o1At(0.7, true).x).toBe(40);
  });

  it('cross-fades a player benched in the next phase', () => {
    const a = phase('p1', { objects: [obj('o1', 0), obj('o2', 100)] });
    const gone = phase('p2', { objects: [obj('o2', 100)] });

    const half = interpolateFrame([a, gone], 0.25, true).objects.find(
      (o) => o.id === 'o1',
    )!;
    expect(half.opacity).toBeGreaterThan(0);
    expect(half.opacity).toBeLessThan(1);

    // once the first phase is done, they are off the floor entirely
    expect(
      interpolateFrame([a, gone], 1).objects.find((o) => o.id === 'o1'),
    ).toBeUndefined();
  });

  it('fades a new player in as their phase starts', () => {
    const a = phase('p1', { objects: [obj('o1', 0)] });
    const added = phase('p2', { objects: [obj('o1', 0), obj('x1', 50, 50)] });

    expect(
      interpolateFrame([a, added], 0).objects.find((o) => o.id === 'x1')!
        .opacity,
    ).toBeCloseTo(0);
  });

  it('keeps the ball with a holder who moves in this phase', () => {
    const a = phase('p1', {
      objects: [obj('o1', 0), obj('o2', 100)],
      ballHolderId: 'o1',
      actions: [
        { id: 'm1', type: 'cut', fromId: 'o1', toPoint: { x: 40, y: 0 } },
      ],
    });

    expect(interpolateFrame([a], 1).ball).toEqual({ x: 40, y: 0 });
  });

  it('carries the ball from passer to receiver on a drawn pass', () => {
    const a = phase('p1', {
      objects: [obj('o1', 0), obj('o2', 100)],
      ballHolderId: 'o1',
      actions: [{ id: 'p1', type: 'pass', fromId: 'o1', toId: 'o2' }],
    });

    expect(interpolateFrame([a], 0.1).ball!.x).toBeLessThan(50);
    expect(interpolateFrame([a], 1).ball).toEqual({ x: 100, y: 0 });
  });

  it('has no ball when nobody holds it', () => {
    expect(interpolateFrame([solo], 0.5).ball).toBeNull();
  });

  it('flies the ball to the rim on a shot', () => {
    const a = phase('p1', {
      objects: [obj('o1', 20, 80)],
      ballHolderId: 'o1',
      actions: [
        { id: 's1', type: 'shot', fromId: 'o1', toPoint: { x: 50, y: 10 } },
      ],
    });

    expect(interpolateFrame([a], 0.1).ball!.y).toBeGreaterThan(50); // near the shooter
    expect(interpolateFrame([a], 1).ball).toMatchObject({ x: 50, y: 10 });
  });

  it('draws each route in step with its beat', () => {
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

    const early = interpolateFrame([a], 0.15).routes;
    expect(early.find((r) => r.id === 'a1')!.progress).toBeGreaterThan(0);
    expect(early.find((r) => r.id === 'a2')!.progress).toBe(0);

    const done = interpolateFrame([a], 1).routes;
    expect(done.find((r) => r.id === 'a1')!.progress).toBe(1);
    expect(done.find((r) => r.id === 'a2')!.progress).toBe(1);
  });
});
