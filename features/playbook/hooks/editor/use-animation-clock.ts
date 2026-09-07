'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

type Options = { durationMs: number; loop: boolean };

// A scrubbable playback clock: `progress` is 0..1 across the whole play,
// derived from wall-clock time since the last (re-)anchor, so seeking is
// instant and reversible. Nothing here is persisted.
export function useAnimationClock({ durationMs, loop }: Options) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  // bumped whenever the loop must re-anchor (play / restart / seek-while-playing)
  const [epoch, setEpoch] = useState(0);

  const progressRef = useRef(0);

  const write = useCallback((next: number) => {
    progressRef.current = next;
    setProgress(next);
  }, []);

  const reanchor = useCallback(() => setEpoch((e) => e + 1), []);

  useEffect(() => {
    if (!playing) return;

    let raf = 0;
    let anchorAt = performance.now();
    let anchorProgress = progressRef.current >= 1 ? 0 : progressRef.current;
    if (anchorProgress !== progressRef.current) write(anchorProgress);

    const step = () => {
      const elapsed = performance.now() - anchorAt;
      let next = durationMs > 0 ? anchorProgress + elapsed / durationMs : 1;

      if (next >= 1) {
        if (loop && durationMs > 0) {
          next %= 1;
          anchorAt = performance.now();
          anchorProgress = next;
        } else {
          write(1);
          setPlaying(false);
          return;
        }
      }

      write(next);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, epoch, durationMs, loop, write]);

  const play = useCallback(() => {
    setPlaying(true);
    reanchor();
  }, [reanchor]);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    setPlaying((p) => !p);
    reanchor();
  }, [reanchor]);

  const seek = useCallback(
    (p: number) => {
      write(clamp01(p));
      reanchor();
    },
    [write, reanchor],
  );

  const restart = useCallback(() => {
    write(0);
    setPlaying(true);
    reanchor();
  }, [write, reanchor]);

  return { progress, playing, play, pause, toggle, seek, restart };
}
