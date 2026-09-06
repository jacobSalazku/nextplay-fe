import { RosterPanel } from '../components/editor/roster-panel';
import type { PlacedObject } from '../utils/diagram/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const offense = (n: number): PlacedObject => ({
  id: `o${n}`,
  kind: 'offense',
  label: String(n),
  x: 50,
  y: 50,
});

function renderPanel(
  overrides: Partial<Parameters<typeof RosterPanel>[0]> = {},
) {
  const props = {
    objects: [offense(1), offense(2)],
    rosterCount: { offense: 5, defense: 5 },
    ballHolderId: undefined,
    selectedId: null,
    onBench: vi.fn(),
    onUnbench: vi.fn(),
    onAddSlot: vi.fn(),
    onMatchManToMan: vi.fn(),
    onSetBall: vi.fn(),
    onSelect: vi.fn(),
    ...overrides,
  };
  render(<RosterPanel {...props} />);
  return props;
}

describe('RosterPanel', () => {
  it('shows a slot per player and marks which are on court', () => {
    // Act
    renderPanel();

    // Assert — 5 offense + 5 opponent slots
    expect(
      screen.getByRole('button', { name: 'Player 1, on court' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Player 3, benched' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('button', { name: 'Opponent 1, benched' }),
    ).toBeInTheDocument();
  });

  it('benches an on-court player and selects it', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onBench, onSelect } = renderPanel();

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Player 1, on court' }),
    );

    // Assert
    expect(onSelect).toHaveBeenCalledWith('o1');
    expect(onBench).toHaveBeenCalledWith('o1');
  });

  it('un-benches a benched player', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onUnbench } = renderPanel();

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Opponent 2, benched' }),
    );

    // Assert
    expect(onUnbench).toHaveBeenCalledWith('x2');
  });

  it('gives the ball from an on-court player chip', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onSetBall } = renderPanel();

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Give the ball to 2' }),
    );

    // Assert
    expect(onSetBall).toHaveBeenCalledWith('o2');
  });

  it('has no ball button for a benched or opponent slot', () => {
    // Act
    renderPanel({ ballHolderId: 'o1' });

    // Assert
    expect(
      screen.queryByRole('button', { name: /ball to 3/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Take the ball from 1' }),
    ).toBeInTheDocument();
  });

  it('matches man-to-man', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onMatchManToMan } = renderPanel();

    // Act
    await user.click(screen.getByRole('button', { name: /match man-to-man/i }));

    // Assert
    expect(onMatchManToMan).toHaveBeenCalledOnce();
  });

  it('adds a slot', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onAddSlot } = renderPanel();

    // Act
    await user.click(screen.getByRole('button', { name: 'Add player' }));

    // Assert
    expect(onAddSlot).toHaveBeenCalledWith('offense');
  });

  it('hides the + button at the cap', () => {
    // Act
    renderPanel({ rosterCount: { offense: 7, defense: 5 } });

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Add player' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add opponent' }),
    ).toBeInTheDocument();
  });
});
