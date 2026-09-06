import type {
  Action,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import {
  actionChord,
  angleTo,
  bendHandle,
  bendOffset,
  nearestToken,
} from '@/features/playbook/utils/editor/draw-geometry';
import { describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 0, y: 0 },
  { id: 'o2', kind: 'offense', label: '2', x: 40, y: 0 },
  { id: 'x1', kind: 'defense', label: 'x1', x: 20, y: 30 },
];

describe('actionChord', () => {
  it('resolves player-to-player and player-to-point', () => {
    expect(actionChord({ fromId: 'o1', toId: 'o2' }, objects)).toEqual({
      from: { x: 0, y: 0 },
      to: { x: 40, y: 0 },
    });

    expect(
      actionChord({ fromId: 'o1', toPoint: { x: 5, y: 9 } }, objects),
    ).toEqual({ from: { x: 0, y: 0 }, to: { x: 5, y: 9 } });
  });

  it('is null when an endpoint is missing', () => {
    expect(actionChord({ fromId: 'gone', toId: 'o2' }, objects)).toBeNull();
    expect(actionChord({ fromId: 'o1', toId: 'gone' }, objects)).toBeNull();
  });
});

describe('bendHandle', () => {
  const base: Action = { id: 'a1', type: 'pass', fromId: 'o1', toId: 'o2' };

  it('sits on the chord midpoint for a straight action', () => {
    expect(bendHandle(base, objects)).toEqual({ x: 20, y: 0 });
  });

  it('adds the stored offset when the action is bent', () => {
    expect(bendHandle({ ...base, bend: { x: 0, y: -8 } }, objects)).toEqual({
      x: 20,
      y: -8,
    });
  });
});

describe('bendOffset', () => {
  const chord = { from: { x: 0, y: 0 }, to: { x: 40, y: 0 } }; // midpoint 20,0

  it('returns the offset from the midpoint for a real drag', () => {
    expect(bendOffset(chord, { x: 20, y: 12 })).toEqual({ x: 0, y: 12 });
  });

  it('returns null near the midpoint (snap straight)', () => {
    expect(bendOffset(chord, { x: 21, y: 1 })).toBeNull();
  });
});

describe('nearestToken', () => {
  it('finds the closest token within the radius', () => {
    expect(nearestToken({ x: 38, y: 2 }, objects, 6)?.id).toBe('o2');
  });

  it('is null when nothing is close enough', () => {
    expect(nearestToken({ x: 100, y: 100 }, objects, 6)).toBeNull();
  });

  it('skips the excluded token', () => {
    expect(nearestToken({ x: 0, y: 0 }, objects, 6, 'o1')).toBeNull();
  });
});

describe('angleTo', () => {
  it('measures degrees between two points', () => {
    expect(angleTo({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(0);
    expect(angleTo({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(90);
    expect(angleTo({ x: 0, y: 0 }, { x: -1, y: 0 })).toBe(180);
  });
});
