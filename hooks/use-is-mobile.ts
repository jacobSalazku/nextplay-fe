import { useEffect, useState } from 'react';

// True when the viewport is narrower than `breakpoint`. Starts false so SSR and
// the first paint match the desktop layout; syncs on mount and on later changes.
export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const sync = () => setIsMobile(mql.matches);

    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [breakpoint]);

  return isMobile;
}
