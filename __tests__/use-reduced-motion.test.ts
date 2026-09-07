import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

function stubMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  };
  vi.stubGlobal('matchMedia', () => mql);
  return {
    set(next: boolean) {
      mql.matches = next;
      listeners.forEach((cb) => cb());
    },
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('useReducedMotion', () => {
  it('reports the current preference', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('updates when the preference changes', () => {
    const mm = stubMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => mm.set(true));
    expect(result.current).toBe(true);
  });
});
