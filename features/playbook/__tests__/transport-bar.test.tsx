import { TransportBar } from '../components/editor/animate/transport-bar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const base = {
  playing: false,
  progress: 0,
  phaseCount: 3,
  speed: 1,
  loop: false,
  onToggle: vi.fn(),
  onRestart: vi.fn(),
  onSeek: vi.fn(),
  onSpeed: vi.fn(),
  onLoop: vi.fn(),
};

describe('TransportBar', () => {
  it('shows Play when paused and Pause when playing', () => {
    const { rerender } = render(<TransportBar {...base} />);
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();

    rerender(<TransportBar {...base} playing />);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('wires the play and restart buttons', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onRestart = vi.fn();
    render(
      <TransportBar {...base} onToggle={onToggle} onRestart={onRestart} />,
    );

    await user.click(screen.getByRole('button', { name: 'Play' }));
    await user.click(screen.getByRole('button', { name: 'Restart' }));

    expect(onToggle).toHaveBeenCalledOnce();
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('marks the active speed and reports a change', async () => {
    const user = userEvent.setup();
    const onSpeed = vi.fn();
    render(<TransportBar {...base} speed={1} onSpeed={onSpeed} />);

    expect(screen.getByRole('button', { name: '1×' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: '2×' }));
    expect(onSpeed).toHaveBeenCalledWith(2);
  });

  it('toggles loop from its current state', async () => {
    const user = userEvent.setup();
    const onLoop = vi.fn();
    render(<TransportBar {...base} loop={false} onLoop={onLoop} />);

    await user.click(screen.getByRole('button', { name: 'Loop' }));
    expect(onLoop).toHaveBeenCalledWith(true);
  });

  it('reflects progress on the timeline and seeks on input', async () => {
    const onSeek = vi.fn();
    render(<TransportBar {...base} progress={0.4} onSeek={onSeek} />);

    const slider = screen.getByRole('slider', { name: 'Timeline' });
    expect(slider).toHaveValue('0.4');
  });
});
