import { AnimateView } from '../components/editor/animate/animate-view';
import type { Phase } from '../utils/diagram/types';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const phase = (id: string, x: number, over: Partial<Phase> = {}): Phase => ({
  id,
  objects: [
    { id: 'o1', kind: 'offense', label: '1', x, y: 20 },
    { id: 'o2', kind: 'offense', label: '2', x: 60, y: 60 },
  ],
  actions: [],
  ...over,
});

const twoPhases = (over: Partial<Phase> = {}): Phase[] => [
  phase('p1', 10, over),
  phase('p2', 80),
];

const props = {
  court: 'half' as const,
  onStepsChange: vi.fn(),
  onEditStart: vi.fn(),
  onRemoveAction: vi.fn(),
};

// keep the rAF playback loop from firing setState after a test unmounts
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', () => 0);
  vi.stubGlobal('cancelAnimationFrame', () => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('AnimateView', () => {
  it('asks for a second phase when there is only one', () => {
    render(<AnimateView {...props} phases={[phase('p1', 10)]} />);

    expect(screen.getByText(/add a second phase/i)).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /animation/i })).toBeNull();
  });

  it('renders the rail, stage, transport and the action timeline', () => {
    render(<AnimateView {...props} phases={twoPhases()} />);

    expect(
      screen.getByRole('navigation', { name: 'Phases' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /play animation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('slider', { name: 'Timeline' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Action timeline' }),
    ).toBeInTheDocument();
  });

  it('starts playing on the spacebar', async () => {
    const user = userEvent.setup();
    render(<AnimateView {...props} phases={twoPhases()} />);

    await user.keyboard(' ');

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('sequences the current transition when a move is split into a step', () => {
    const onStepsChange = vi.fn();
    render(
      <AnimateView
        {...props}
        onStepsChange={onStepsChange}
        phases={twoPhases({
          actions: [
            { id: 'a1', type: 'cut', fromId: 'o1', toId: 'o2' },
            { id: 'a2', type: 'pass', fromId: 'o1', toId: 'o2' },
          ],
        })}
      />,
    );

    fireEvent.dragStart(screen.getByText('Pass by Player 1'));
    const gaps = document.querySelectorAll('[data-drop-gap]');
    fireEvent.drop(gaps[gaps.length - 1]);

    expect(onStepsChange).toHaveBeenCalledWith(0, [
      { id: 'g0', actionIds: ['a1'], durationMs: 700 },
      { id: 'g1', actionIds: ['a2'], durationMs: 700 },
    ]);
  });

  it('removes an action from the current phase', async () => {
    const user = userEvent.setup();
    const onRemoveAction = vi.fn();
    render(
      <AnimateView
        {...props}
        onRemoveAction={onRemoveAction}
        phases={twoPhases({
          actions: [{ id: 'a1', type: 'cut', fromId: 'o1', toId: 'o2' }],
        })}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Timing options' }));
    await user.click(screen.getByRole('button', { name: 'Remove action' }));

    expect(onRemoveAction).toHaveBeenCalledWith(0, 'a1');
  });
});
