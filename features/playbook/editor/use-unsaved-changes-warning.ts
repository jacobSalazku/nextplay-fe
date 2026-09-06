import { useEffect } from 'react';

// Warns on tab close / reload / hard navigation while there are unsaved edits.
// In-app navigation is guarded separately (the editor confirms before leaving).
export function useUnsavedChangesWarning(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [enabled]);
}
