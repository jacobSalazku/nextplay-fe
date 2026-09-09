import { MAX_PHASES } from '@/features/playbook/utils/editor/phase-rail';
import { describe, expect, it } from 'vitest';

describe('phase rail limits', () => {
  it('caps the number of phases', () => {
    expect(MAX_PHASES).toBe(15);
  });
});
