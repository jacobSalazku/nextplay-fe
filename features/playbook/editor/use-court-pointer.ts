import { useCallback, type RefObject } from 'react';
import type { Point } from '@/features/playbook/diagram/types';

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

// Maps a pointer event to court coordinates (0..100 on both axes). The element
// must be locked to the court's aspect ratio so there is no letterboxing.
export function useCourtPointer(ref: RefObject<HTMLElement | null>) {
  return useCallback(
    (event: { clientX: number; clientY: number }): Point => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

      return {
        x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
      };
    },
    [ref],
  );
}
