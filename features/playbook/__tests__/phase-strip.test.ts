import { phaseIndexAtX } from '@/features/playbook/utils/editor/phase-strip';
import { describe, expect, it } from 'vitest';

describe('phaseIndexAtX', () => {
  const bounds = [
    { left: 0, right: 40 }, // mid 20
    { left: 40, right: 80 }, // mid 60
    { left: 80, right: 120 }, // mid 100
  ];

  it('drops before the thumbnail whose midpoint the pointer has not yet passed', () => {
    expect(phaseIndexAtX(bounds, 10)).toBe(0);
    expect(phaseIndexAtX(bounds, 50)).toBe(1);
    expect(phaseIndexAtX(bounds, 90)).toBe(2);
  });

  it('clamps to the last thumbnail past the end', () => {
    expect(phaseIndexAtX(bounds, 999)).toBe(2);
  });

  it('handles an empty strip', () => {
    expect(phaseIndexAtX([], 10)).toBe(0);
  });
});
