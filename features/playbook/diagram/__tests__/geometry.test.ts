import { actionEndpoints, bezierPoint, perpAt, routePath } from '../geometry';
import type { PlacedObject } from '../types';
import { describe, expect, it } from 'vitest';

const a = { x: 0, y: 0 };
const b = { x: 10, y: 0 };

describe('bezierPoint', () => {
  it('returns the start at t=0 and the end at t=1 on a straight line', () => {
    // Arrange / Act / Assert
    expect(bezierPoint(a, b, null, 0)).toEqual(a);
    expect(bezierPoint(a, b, null, 1)).toEqual(b);
  });

  it('bows toward the control point at the midpoint of a curve', () => {
    // Arrange
    const ctrl = { x: 5, y: 10 };

    // Act
    const mid = bezierPoint(a, b, ctrl, 0.5);

    // Assert
    expect(mid.x).toBeCloseTo(5);
    expect(mid.y).toBeCloseTo(5);
  });
});

describe('perpAt', () => {
  it('is a unit vector perpendicular to a straight line', () => {
    // Act
    const p = perpAt(a, b, null, 0.5);

    // Assert
    expect(Math.hypot(p.x, p.y)).toBeCloseTo(1);
    expect(p.x * (b.x - a.x) + p.y * (b.y - a.y)).toBeCloseTo(0);
  });
});

describe('routePath', () => {
  it('draws a straight line segment for a pass without a bend', () => {
    // Act
    const d = routePath('pass', a, b, null);

    // Assert
    expect(d).toBe('M0 0 L10 0');
  });

  it('draws a quadratic curve when a control point is given', () => {
    // Act
    const d = routePath('cut', a, b, { x: 5, y: 8 });

    // Assert
    expect(d).toContain('Q5 8');
  });

  it('adds a perpendicular end bar for a screen', () => {
    // Act
    const d = routePath('screen', a, b, null);

    // Assert — one extra subpath after the main line
    expect(d.match(/M/g)).toHaveLength(2);
  });

  it('gives a dribble a wavy poly-line with many segments', () => {
    // Act
    const d = routePath('dribble', a, b, null);

    // Assert
    expect((d.match(/L/g) ?? []).length).toBeGreaterThan(5);
  });
});

describe('actionEndpoints', () => {
  const objects: PlacedObject[] = [
    { id: 'o1', kind: 'offense', label: '1', x: 20, y: 80 },
    { id: 'o5', kind: 'offense', label: '5', x: 70, y: 20 },
  ];

  it('resolves a player-to-player action', () => {
    // Act
    const ends = actionEndpoints(
      { id: 'a1', type: 'pass', fromId: 'o1', toId: 'o5' },
      objects,
    );

    // Assert
    expect(ends).toEqual({
      a: { x: 20, y: 80 },
      b: { x: 70, y: 20 },
      ctrl: null,
    });
  });

  it('returns null when the from-object is not in the phase', () => {
    // Act
    const ends = actionEndpoints(
      { id: 'a1', type: 'cut', fromId: 'ghost', toPoint: { x: 1, y: 1 } },
      objects,
    );

    // Assert
    expect(ends).toBeNull();
  });

  it('resolves bend as an offset from the chord midpoint', () => {
    // Act — midpoint of (20,80)->(70,20) is (45,50)
    const ends = actionEndpoints(
      {
        id: 'a1',
        type: 'cut',
        fromId: 'o1',
        toId: 'o5',
        bend: { x: 4, y: -6 },
      },
      objects,
    );

    // Assert
    expect(ends?.ctrl).toEqual({ x: 49, y: 44 });
  });
});
