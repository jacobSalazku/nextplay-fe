import { useAnimationClock } from '@/features/playbook/hooks/editor/use-animation-clock';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let frames: FrameRequestCallback[] = [];
let now = 0;

function pump(ms: number) {
  now += ms;
  const due = frames;
  frames = [];
  act(() => due.forEach((cb) => cb(now)));
}

beforeEach(() => {
  frames = [];
  now = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.push(cb);
    return frames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
  vi.spyOn(performance, 'now').mockImplementation(() => now);
});

afterEach(() => vi.unstubAllGlobals());

describe('useAnimationClock', () => {
  it('starts paused at zero', () => {
    const { result } = renderHook(() =>
      useAnimationClock({ durationMs: 1000, loop: false }),
    );

    expect(result.current).toMatchObject({ progress: 0, playing: false });
  });

  it('advances progress in proportion to elapsed time while playing', () => {
    const { result } = renderHook(() =>
      useAnimationClock({ durationMs: 1000, loop: false }),
    );

    act(() => result.current.play());
    expect(result.current.playing).toBe(true);

    pump(250);
    expect(result.current.progress).toBeCloseTo(0.25);
  });

  it('stops at the end and clears playing when not looping', () => {
    const { result } = renderHook(() =>
      useAnimationClock({ durationMs: 1000, loop: false }),
    );

    act(() => result.current.play());
    pump(1200);

    expect(result.current.progress).toBe(1);
    expect(result.current.playing).toBe(false);
  });

  it('wraps past the end when looping', () => {
    const { result } = renderHook(() =>
      useAnimationClock({ durationMs: 1000, loop: true }),
    );

    act(() => result.current.play());
    pump(1200);

    expect(result.current.playing).toBe(true);
    expect(result.current.progress).toBeCloseTo(0.2);
  });

  it('clamps a seek into 0..1 and leaves it there when paused', () => {
    const { result } = renderHook(() =>
      useAnimationClock({ durationMs: 1000, loop: false }),
    );

    act(() => result.current.seek(2));
    expect(result.current.progress).toBe(1);

    act(() => result.current.seek(-1));
    expect(result.current.progress).toBe(0);
  });

  it('restarts from zero after finishing', () => {
    const { result } = renderHook(() =>
      useAnimationClock({ durationMs: 1000, loop: false }),
    );

    act(() => result.current.play());
    pump(1200);
    act(() => result.current.restart());

    expect(result.current).toMatchObject({ progress: 0, playing: true });
  });
});
