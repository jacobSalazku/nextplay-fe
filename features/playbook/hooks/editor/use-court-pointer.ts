import { useCallback, type RefObject } from 'react';
import type { Point } from '@/features/playbook/utils/diagram/types';

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

// sub-pixel court precision is meaningless and only clutters the saved diagram
const round = (n: number) => Math.round(n * 100) / 100;

// Maps a pointer event to court coordinates (0..100 on both axes), or null if
// the element has no box yet.
//
// `aspect` is the court's on-screen width / height ratio, or `null` when the
// court is stretched to fill the box (preserveAspectRatio="none"). With a ratio
// the court is letterboxed inside the box, so the bars are subtracted before
// mapping — pass `null` and the box maps straight onto court space.
export function useCourtPointer(
  ref: RefObject<HTMLElement | null>,
  aspect: number | null,
) {
  return useCallback(
    (event: { clientX: number; clientY: number }): Point | null => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return null;

      const wide = aspect != null && rect.width / rect.height > aspect;
      const tall = aspect != null && rect.width / rect.height < aspect;
      const width = wide ? rect.height * aspect : rect.width;
      const height = tall ? rect.width / aspect : rect.height;
      const left = rect.left + (rect.width - width) / 2;
      const top = rect.top + (rect.height - height) / 2;

      return {
        x: round(clamp(((event.clientX - left) / width) * 100, 0, 100)),
        y: round(clamp(((event.clientY - top) / height) * 100, 0, 100)),
      };
    },
    [ref, aspect],
  );
}
