import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import {
  benchForSide,
  makeSlotObject,
  manToManPosition,
  roleHome,
  slotId,
  slotKind,
  slotNumber,
} from '@/features/playbook/utils/editor/roster';
import { describe, expect, it } from 'vitest';

describe('roster helpers', () => {
  it('builds slot ids and reads them back', () => {
    expect(slotId('offense', 3)).toBe('o3');
    expect(slotId('defense', 1)).toBe('x1');
    expect(slotKind('x2')).toBe('defense');
    expect(slotKind('o5')).toBe('offense');
    expect(slotNumber('o4')).toBe(4);
  });

  it('gives each position its own home spot', () => {
    // the point guard sits high and central, the centre sits low
    expect(roleHome('o1').y).toBeGreaterThan(roleHome('o5').y);
    expect(roleHome('o1').x).toBe(50);
  });

  it('drops a defender between its home spot and the rim', () => {
    const attackHome = roleHome('o1');
    const defendHome = roleHome('x1');

    // same lane, but closer to the basket (smaller y)
    expect(defendHome.x).toBe(attackHome.x);
    expect(defendHome.y).toBeLessThan(attackHome.y);
  });

  it('places a man-to-man defender a quarter of the way to the rim', () => {
    // Arrange — attacker at (40, 60), rim at (50, 16)
    const at = manToManPosition({ x: 40, y: 60 });

    // Assert
    expect(at.x).toBeCloseTo(42.5);
    expect(at.y).toBeCloseTo(49);
  });

  it('makes a labelled slot object at a given spot', () => {
    // Act
    const o = makeSlotObject('offense', 2, { x: 30, y: 40 });

    // Assert
    expect(o).toEqual({
      id: 'o2',
      kind: 'offense',
      label: '2',
      x: 30,
      y: 40,
    });
  });

  it('lists the benched slots for a side', () => {
    // Arrange — only o1 and o3 are on court
    const objects: PlacedObject[] = [
      { id: 'o1', kind: 'offense', label: '1', x: 0, y: 0 },
      { id: 'o3', kind: 'offense', label: '3', x: 0, y: 0 },
    ];

    // Act
    const bench = benchForSide(objects, 'offense', 5);

    // Assert — 2, 4, 5 are benched
    expect(bench.map((o) => o.id)).toEqual(['o2', 'o4', 'o5']);
  });
});
