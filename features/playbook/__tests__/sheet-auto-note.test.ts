import type { Phase } from '../utils/diagram/types';
import { autoNote } from '../utils/sheet/auto-note';
import { describe, expect, it } from 'vitest';

const phase = (over: Partial<Phase>): Phase => ({
  id: 'p1',
  objects: [
    { id: 'o1', kind: 'offense', label: '1', x: 20, y: 80 },
    { id: 'o3', kind: 'offense', label: '3', x: 80, y: 55 },
    { id: 'o5', kind: 'offense', label: '5', x: 60, y: 30 },
  ],
  actions: [],
  ...over,
});

describe('autoNote', () => {
  it('is empty when nothing was drawn', () => {
    expect(autoNote(phase({}))).toBe('');
  });

  it('names the passer and receiver', () => {
    expect(
      autoNote(
        phase({
          actions: [{ id: 'a', type: 'pass', fromId: 'o1', toId: 'o3' }],
        }),
      ),
    ).toBe('1 passes to 3');
  });

  it('drops the target when a pass goes to open space', () => {
    expect(
      autoNote(
        phase({
          actions: [
            { id: 'a', type: 'pass', fromId: 'o1', toPoint: { x: 50, y: 40 } },
          ],
        }),
      ),
    ).toBe('1 passes');
  });

  it('joins several actions in drawn order', () => {
    expect(
      autoNote(
        phase({
          actions: [
            { id: 'a', type: 'screen', fromId: 'o5', toId: 'o3' },
            { id: 'b', type: 'cut', fromId: 'o3', toPoint: { x: 90, y: 20 } },
            { id: 'c', type: 'shot', fromId: 'o3', toPoint: { x: 50, y: 5 } },
          ],
        }),
      ),
    ).toBe('5 screens for 3   ·   3 cuts   ·   3 shoots');
  });
});
