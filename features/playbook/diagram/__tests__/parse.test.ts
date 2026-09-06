import { asPlayDiagram } from '../parse';
import { describe, expect, it } from 'vitest';

const valid = {
  version: 1,
  court: 'half',
  phases: [{ id: 'p1', objects: [], actions: [] }],
  timeline: [],
};

describe('asPlayDiagram', () => {
  it('returns the diagram when the shape is right', () => {
    // Act / Assert
    expect(asPlayDiagram(valid)).toBe(valid);
  });

  it('rejects a legacy canvas play (null / non-object)', () => {
    // Act / Assert
    expect(asPlayDiagram(null)).toBeNull();
    expect(asPlayDiagram('data:image/png;base64,abc')).toBeNull();
  });

  it('rejects a wrong version, court, or empty phases', () => {
    // Act / Assert
    expect(asPlayDiagram({ ...valid, version: 2 })).toBeNull();
    expect(asPlayDiagram({ ...valid, court: 'quarter' })).toBeNull();
    expect(asPlayDiagram({ ...valid, phases: [] })).toBeNull();
  });
});
