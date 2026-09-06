import { useCourtPointer } from '@/features/playbook/hooks/editor/use-court-pointer';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function refTo(rect: Partial<DOMRect>) {
  return {
    current: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        ...rect,
      }),
    } as unknown as HTMLElement,
  };
}

describe('useCourtPointer', () => {
  it('maps a client point into 0..100 court space', () => {
    // Arrange
    const { result } = renderHook(() =>
      useCourtPointer(refTo({ left: 20, top: 40, width: 200, height: 400 })),
    );

    // Act
    const point = result.current({ clientX: 120, clientY: 240 });

    // Assert — halfway across, halfway down
    expect(point).toEqual({ x: 50, y: 50 });
  });

  it('clamps points outside the element', () => {
    // Arrange
    const { result } = renderHook(() =>
      useCourtPointer(refTo({ left: 0, top: 0, width: 100, height: 100 })),
    );

    // Act / Assert
    expect(result.current({ clientX: 500, clientY: -20 })).toEqual({
      x: 100,
      y: 0,
    });
  });

  it('returns null when the element has no box yet', () => {
    // Arrange
    const { result } = renderHook(() => useCourtPointer({ current: null }));

    // Act / Assert
    expect(result.current({ clientX: 10, clientY: 10 })).toBeNull();
  });
});
