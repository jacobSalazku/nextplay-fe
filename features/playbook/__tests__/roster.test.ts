import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import {
  benchForSide,
  homePosition,
  makeSlotObject,
  manToManPosition,
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

  it('makes a labelled slot object at its home position', () => {
    // Act
    const o = makeSlotObject('defense', 2);

    // Assert
    expect(o).toMatchObject({ id: 'x2', kind: 'defense', label: '2' });
    expect(o).toMatchObject(homePosition('defense', 2));
  });

  it('places a man-to-man defender a step toward the basket', () => {
    // Arrange
    const attacker: PlacedObject = {
      id: 'o1',
      kind: 'offense',
      label: '1',
      x: 40,
      y: 60,
    };

    // Act / Assert
    expect(manToManPosition(attacker)).toEqual({ x: 40, y: 52 });
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
