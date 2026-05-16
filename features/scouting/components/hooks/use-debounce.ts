import { useEffect, useRef } from 'react';
import type { PlayersData } from '@/features/scouting/components/multi-statline-tracker';

type SaveFn = (data: PlayersData) => Promise<void>;

export function useDebouncedSave(
  stats: PlayersData | undefined,
  handleSubmit: SaveFn,
  delay = 60000,
) {
  const isSaving = useRef(false);
  const queuedStats = useRef<PlayersData | undefined>(undefined);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStats = useRef<PlayersData | undefined>(undefined);

  useEffect(() => {
    if (!stats) return;

    // If stats haven't changed since last save, do nothing
    if (lastSavedStats.current && deepEqual(stats, lastSavedStats.current)) {
      return;
    }

    // If currently saving, queue the latest stats and exit
    if (isSaving.current) {
      queuedStats.current = stats;
      return;
    }

    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      const saveStats = async () => {
        isSaving.current = true;
        try {
          await handleSubmit(stats);
          lastSavedStats.current = stats;
        } catch (error) {
          console.error('Failed to save stats:', error);
        } finally {
          isSaving.current = false;

          if (
            queuedStats.current &&
            !deepEqual(queuedStats.current, lastSavedStats.current)
          ) {
            const nextStats = queuedStats.current;
            queuedStats.current = undefined;

            if (timeoutId.current) clearTimeout(timeoutId.current);

            timeoutId.current = setTimeout(() => {
              if (nextStats) {
                handleSubmit(nextStats)
                  .then(() => {
                    lastSavedStats.current = nextStats;
                  })
                  .catch(console.error);
              }
            }, delay);
          }
        }
      };
      void saveStats();
    }, delay);

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [stats, handleSubmit, delay]);
}

// Simple deep equal check for PlayersData (replace with your own deep equality logic or lodash's isEqual)
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
