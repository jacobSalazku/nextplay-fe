import { useNavigationGuard } from '@/features/playbook/hooks/editor/use-navigation-guard';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

function fireBeforeUnload() {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

afterEach(() => vi.restoreAllMocks());

describe('useNavigationGuard', () => {
  const noop = () => {};

  it('blocks reload / tab close only while there are unsaved edits', () => {
    // Arrange
    const { rerender } = renderHook(
      ({ enabled }) =>
        useNavigationGuard({
          enabled,
          confirm: () => Promise.resolve(true),
          onLeave: noop,
        }),
      { initialProps: { enabled: false } },
    );

    // Assert — clean: the unload event is not cancelled
    expect(fireBeforeUnload().defaultPrevented).toBe(false);

    // Act — now dirty
    rerender({ enabled: true });

    // Assert — dirty: the browser will prompt
    expect(fireBeforeUnload().defaultPrevented).toBe(true);
  });

  it('confirms on browser back and stays put when the user cancels', async () => {
    // Arrange
    const confirm = vi.fn().mockResolvedValue(false);
    const onLeave = vi.fn();
    const pushState = vi.spyOn(window.history, 'pushState');
    renderHook(() => useNavigationGuard({ enabled: true, confirm, onLeave }));
    pushState.mockClear();

    // Act — the browser Back button
    window.dispatchEvent(new PopStateEvent('popstate'));
    await vi.waitFor(() => expect(confirm).toHaveBeenCalled());

    // Assert — cancelled: re-trapped, no navigation
    expect(pushState).toHaveBeenCalled();
    expect(onLeave).not.toHaveBeenCalled();
  });

  it('leaves for the playbook when the user confirms the browser back', async () => {
    // Arrange
    const onLeave = vi.fn();
    renderHook(() =>
      useNavigationGuard({
        enabled: true,
        confirm: () => Promise.resolve(true),
        onLeave,
      }),
    );

    // Act
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Assert
    await vi.waitFor(() => expect(onLeave).toHaveBeenCalled());
  });
});
