import { useEffect, useRef } from 'react';

type Options = {
  // true while there is unsaved work
  enabled: boolean;
  // shown for a browser back/forward; resolve true to allow leaving
  confirm: () => Promise<boolean>;
  // where to go when the user confirms leaving via back/forward
  onLeave: () => void;
};

// Guards the editor against losing unsaved work:
//  - reload / tab close / address bar  -> native beforeunload prompt
//  - browser back / forward            -> confirm(), via a history sentinel
// In-app navigation (links, the editor's own back button) is guarded at the
// call site — the App Router exposes no navigation event to hook here.
export function useNavigationGuard({ enabled, confirm, onLeave }: Options) {
  const confirmRef = useRef(confirm);
  const onLeaveRef = useRef(onLeave);
  useEffect(() => {
    confirmRef.current = confirm;
    onLeaveRef.current = onLeave;
  });

  useEffect(() => {
    if (!enabled) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    // A duplicate history entry so the first Back fires popstate on this page
    // instead of leaving it; re-pushed whenever the user cancels.
    window.history.pushState(null, '', window.location.href);

    const onPopState = async () => {
      if (await confirmRef.current()) {
        window.removeEventListener('popstate', onPopState);
        onLeaveRef.current();
      } else {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [enabled]);
}
