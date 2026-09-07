import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Whether the viewer asked the OS to minimise motion. Starts false so SSR and
// the first paint match; syncs on mount and on later changes.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const sync = () => setReduced(mql.matches);

    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  return reduced;
}
