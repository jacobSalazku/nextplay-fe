import { phaseIndexAt } from '@/features/playbook/utils/editor/phase-rail';
import { describe, expect, it } from 'vitest';

const rows = [
  { start: 0, end: 100 },
  { start: 100, end: 200 },
  { start: 200, end: 300 },
];

describe('phaseIndexAt', () => {
  it('returns the slot whose first half the coordinate is in', () => {
    expect(phaseIndexAt(rows, 40)).toBe(0);
    expect(phaseIndexAt(rows, 60)).toBe(1);
    expect(phaseIndexAt(rows, 130)).toBe(1);
    expect(phaseIndexAt(rows, 170)).toBe(2);
  });

  it('clamps past the last slot', () => {
    expect(phaseIndexAt(rows, 999)).toBe(2);
  });
});
