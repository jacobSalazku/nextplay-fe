import { ShareButton } from '../components/editor/share-button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const copyShareLink = vi.fn();
vi.mock('@/features/playbook/utils/copy-share-link', () => ({
  copyShareLink: (...args: unknown[]) => copyShareLink(...args),
}));

describe('ShareButton', () => {
  it('copies the link for this play on click', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ShareButton routeKey="cavs-1" playId="play-9" />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Share' }));

    // Assert
    expect(copyShareLink).toHaveBeenCalledWith('cavs-1', 'play-9');
  });

  it('stays labelled once its text collapses on small screens', () => {
    // Arrange — the "Share" text is CSS-hidden below sm, so the accessible
    // name has to come from aria-label, not the (jsdom-invisible) text node
    render(<ShareButton routeKey="cavs-1" playId="play-9" />);

    // Assert
    expect(screen.getByRole('button', { name: 'Share' })).toHaveAttribute(
      'aria-label',
      'Share',
    );
  });
});
