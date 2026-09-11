import { useEffect, useRef, type RefObject } from 'react';

// Closes an open popover / sheet on Escape, and — when `ref` is given — on a
// pointerdown outside it. Only re-binds when `open` changes.
export function useDismiss(
  open: boolean,
  onClose: () => void,
  ref?: RefObject<HTMLElement | null>,
) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close.current();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!ref?.current?.contains(event.target as Node)) close.current();
    };

    window.addEventListener('keydown', onKey);
    if (ref) document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (ref) document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, ref]);
}
