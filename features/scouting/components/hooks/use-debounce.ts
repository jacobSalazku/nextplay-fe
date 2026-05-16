import { useCallback, useEffect, useRef } from 'react';
import type { PlayersData } from '@/features/scouting/components/multi-statline-tracker';

type SaveFn = (data: PlayersData) => Promise<void>;

export function useDebouncedSave(
  stats: PlayersData | undefined,
  handleSubmit: SaveFn,
  delay = 60000,
) {
  const isSavingRef = useRef(false);
  const queuedStatsRef = useRef<PlayersData | undefined>(undefined);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSignatureRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);
  const latestStatsRef = useRef<PlayersData | undefined>(stats);
  const saveRef = useRef(handleSubmit);

  useEffect(() => {
    latestStatsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    saveRef.current = handleSubmit;
  }, [handleSubmit]);

  const clearPendingTimer = useCallback(() => {
    if (!timeoutIdRef.current) return;
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
  }, []);

  const getSignature = useCallback((value: PlayersData): string => {
    // We use a serialized snapshot to compare full form changes.
    return JSON.stringify(value);
  }, []);

  const flushSave = useCallback(
    async (candidate: PlayersData | undefined) => {
      if (!candidate) return;

      let nextCandidate: PlayersData | undefined = candidate;

      while (nextCandidate) {
        const nextSignature = getSignature(nextCandidate);
        if (nextSignature === lastSavedSignatureRef.current) {
          return;
        }

        // If a save is currently running, keep only the latest payload.
        if (isSavingRef.current) {
          queuedStatsRef.current = nextCandidate;
          return;
        }

        isSavingRef.current = true;

        try {
          await saveRef.current(nextCandidate);
          lastSavedSignatureRef.current = nextSignature;
        } catch (error) {
          console.error('Failed to save stats:', error);
        } finally {
          isSavingRef.current = false;
        }

        // If edits happened while saving, persist the newest version immediately.
        nextCandidate = queuedStatsRef.current;
        queuedStatsRef.current = undefined;
      }
    },
    [getSignature],
  );

  useEffect(() => {
    if (!stats) return;

    const currentSignature = getSignature(stats);

    // First payload is treated as baseline so we do not auto-save immediately on mount.
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      lastSavedSignatureRef.current = currentSignature;
      return;
    }

    // Skip scheduling when there is no actual change since last successful save.
    if (currentSignature === lastSavedSignatureRef.current) {
      return;
    }

    clearPendingTimer();

    // Debounce edits so we batch rapid field updates into one request.
    timeoutIdRef.current = setTimeout(() => {
      void flushSave(latestStatsRef.current);
    }, delay);
  }, [clearPendingTimer, delay, flushSave, getSignature, stats]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Hidden tab/window means user is leaving or backgrounding the app.
      if (document.visibilityState === 'hidden') {
        clearPendingTimer();
        void flushSave(latestStatsRef.current);
      }
    };

    const handlePageHide = () => {
      // Fallback for browsers/page lifecycle paths where visibility change is not enough.
      clearPendingTimer();
      void flushSave(latestStatsRef.current);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      clearPendingTimer();

      // Component unmount (e.g. route change): attempt one final flush.
      void flushSave(latestStatsRef.current);
    };
  }, [clearPendingTimer, flushSave]);
}
