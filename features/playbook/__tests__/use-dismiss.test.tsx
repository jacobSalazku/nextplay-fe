import { useRef, useState } from 'react';
import { useDismiss } from '../hooks/editor/use-dismiss';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

function Menu({ withRef }: { withRef: boolean }) {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), withRef ? ref : undefined);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        reopen
      </button>
      <div ref={ref}>{open && <p>menu</p>}</div>
      <p>outside</p>
    </div>
  );
}

describe('useDismiss', () => {
  it('closes on Escape', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Menu withRef={false} />);
    expect(screen.getByText('menu')).toBeInTheDocument();

    // Act
    await user.keyboard('{Escape}');

    // Assert
    expect(screen.queryByText('menu')).toBeNull();
  });

  it('closes on a pointerdown outside the ref, but not inside', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Menu withRef />);

    // Act — click inside first
    await user.click(screen.getByText('menu'));

    // Assert — still open
    expect(screen.getByText('menu')).toBeInTheDocument();

    // Act — click outside
    await user.click(screen.getByText('outside'));

    // Assert
    expect(screen.queryByText('menu')).toBeNull();
  });

  it('ignores outside clicks when no ref is given', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Menu withRef={false} />);

    // Act
    await user.click(screen.getByText('outside'));

    // Assert
    expect(screen.getByText('menu')).toBeInTheDocument();
  });
});
