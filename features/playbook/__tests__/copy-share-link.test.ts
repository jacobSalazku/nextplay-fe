import { copyShareLink } from '../utils/copy-share-link';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

describe('copyShareLink', () => {
  it('copies the play-view URL and toasts success', async () => {
    // Act
    await copyShareLink('cavs-1', 'play-9');

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/team/cavs-1/playbook/play/play-9`,
    );
    expect(toastSuccess).toHaveBeenCalledWith(
      'Link copied',
      expect.any(Object),
    );
  });

  it('toasts an error when the clipboard write fails', async () => {
    // Arrange
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
      new Error('denied'),
    );

    // Act
    await copyShareLink('cavs-1', 'play-9');

    // Assert
    expect(toastError).toHaveBeenCalledWith('Could not copy the link');
  });
});
