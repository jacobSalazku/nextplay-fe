import { AnimateView } from '../components/editor/animate/animate-view';
import type { Phase } from '../utils/diagram/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const phase = (id: string, x: number): Phase => ({
  id,
  objects: [{ id: 'o1', kind: 'offense', label: '1', x, y: 20 }],
  actions: [],
});

// keep the rAF playback loop from firing setState after a test unmounts
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', () => 0);
  vi.stubGlobal('cancelAnimationFrame', () => {});
});
afterEach(() => vi.unstubAllGlobals());

describe('AnimateView', () => {
  it('asks for a second phase when there is only one', () => {
    render(<AnimateView court="half" phases={[phase('p1', 10)]} />);

    expect(screen.getByText(/add a second phase/i)).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /animation/i })).toBeNull();
  });

  it('renders the stage and transport once there are two phases', () => {
    render(
      <AnimateView court="half" phases={[phase('p1', 10), phase('p2', 80)]} />,
    );

    expect(
      screen.getByRole('img', { name: /play animation/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    expect(
      screen.getByRole('slider', { name: 'Timeline' }),
    ).toBeInTheDocument();
  });

  it('starts playing on the spacebar', async () => {
    const user = userEvent.setup();
    render(
      <AnimateView court="half" phases={[phase('p1', 10), phase('p2', 80)]} />,
    );

    await user.keyboard(' ');

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });
});
