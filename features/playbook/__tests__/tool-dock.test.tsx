import { ToolDock } from '../components/editor/tool-dock';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('ToolDock', () => {
  it('renders Select plus the six action tools', () => {
    // Act
    render(<ToolDock tool="select" onToolChange={vi.fn()} />);

    // Assert
    for (const label of [
      'Select',
      'Pass',
      'Dribble',
      'Cut',
      'Screen',
      'Shot',
      'Handoff',
    ]) {
      expect(screen.getByRole('button', { name: new RegExp(label) }));
    }
  });

  it('marks the active tool pressed', () => {
    // Act
    render(<ToolDock tool="pass" onToolChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole('button', { name: /pass/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('changes tool on click', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(<ToolDock tool="select" onToolChange={onToolChange} />);

    // Act
    await user.click(screen.getByRole('button', { name: /screen/i }));

    // Assert
    expect(onToolChange).toHaveBeenCalledWith('screen');
  });

  it('maps number keys and V / Escape to tools', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(<ToolDock tool="select" onToolChange={onToolChange} />);

    // Act / Assert
    await user.keyboard('2');
    expect(onToolChange).toHaveBeenLastCalledWith('dribble');

    await user.keyboard('{Escape}');
    expect(onToolChange).toHaveBeenLastCalledWith('select');

    await user.keyboard('v');
    expect(onToolChange).toHaveBeenLastCalledWith('select');
  });

  it('ignores shortcuts while typing in a field', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(
      <>
        <input aria-label="note" />
        <ToolDock tool="select" onToolChange={onToolChange} />
      </>,
    );

    // Act
    await user.click(screen.getByLabelText('note'));
    await user.keyboard('3');

    // Assert
    expect(onToolChange).not.toHaveBeenCalled();
  });
});
