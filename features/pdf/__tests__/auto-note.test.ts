import { autoNote } from '../utils/auto-note';
import type { Phase } from '@/features/playbook/utils/diagram/types';
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
    const note = autoNote(
      phase({ actions: [{ id: 'a', type: 'pass', fromId: 'o1', toId: 'o3' }] }),
    );
    expect(note).toBe('1 passes to 3');
  });

  it('drops the target when a pass goes to open space', () => {
    const note = autoNote(
      phase({
        actions: [
          { id: 'a', type: 'pass', fromId: 'o1', toPoint: { x: 50, y: 40 } },
        ],
      }),
    );
    expect(note).toBe('1 passes');
  });

  it('joins several actions in drawn order', () => {
    const note = autoNote(
      phase({
        actions: [
          { id: 'a', type: 'screen', fromId: 'o5', toId: 'o3' },
          { id: 'b', type: 'cut', fromId: 'o3', toPoint: { x: 90, y: 20 } },
          { id: 'c', type: 'shot', fromId: 'o3', toPoint: { x: 50, y: 5 } },
        ],
      }),
    );
    expect(note).toBe('5 screens for 3   ·   3 cuts   ·   3 shoots');
  });
});
