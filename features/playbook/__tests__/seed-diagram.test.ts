import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import {
  seedDiagram,
  toFormationObjects,
} from '@/features/playbook/utils/editor/seed-diagram';
import { describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 50, y: 82 },
  { id: 'o2', kind: 'offense', label: '2', x: 20, y: 55 },
];

describe('seedDiagram', () => {
  it('wraps a formation in a single starting phase', () => {
    // Act
    const diagram = seedDiagram('half', objects);

    // Assert
    expect(diagram).toEqual({
      version: 1,
      court: 'half',
      phases: [{ id: 'p1', objects, actions: [] }],
      timeline: [],
    });
  });

  it('seeds an empty court when no formation is chosen', () => {
    // Act
    const diagram = seedDiagram('full', []);

    // Assert
    expect(diagram.court).toBe('full');
    expect(diagram.phases[0].objects).toEqual([]);
  });
});

describe('toFormationObjects', () => {
  it('passes an array through and defaults anything else to empty', () => {
    // Act / Assert
    expect(toFormationObjects(objects)).toBe(objects);
    expect(toFormationObjects(null)).toEqual([]);
    expect(toFormationObjects('nope')).toEqual([]);
  });
});
