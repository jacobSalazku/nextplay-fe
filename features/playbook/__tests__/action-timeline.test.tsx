import {
  actionLabel,
  ActionTimeline,
  groupsFromSteps,
  stepsFromGroups,
} from '../components/editor/animate/action-timeline';
import type { Action, PlacedObject } from '../utils/diagram/types';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 20, y: 80 },
  { id: 'o2', kind: 'offense', label: '2', x: 60, y: 40 },
];

const actions: Action[] = [
  { id: 'a1', type: 'dribble', fromId: 'o1', toPoint: { x: 40, y: 40 } },
  { id: 'a2', type: 'pass', fromId: 'o1', toId: 'o2' },
];

const base = {
  phaseNumber: 1,
  actions,
  objects,
  showTitle: false,
  onShowTitleChange: vi.fn(),
  onChange: vi.fn(),
  onRemoveAction: vi.fn(),
  onPlay: vi.fn(),
};

describe('actionLabel', () => {
  it('names the move and the player', () => {
    expect(actionLabel(actions[0], objects)).toBe('Dribble by Player 1');
    expect(actionLabel(actions[1], objects)).toBe('Pass by Player 1');
  });
});

describe('groupsFromSteps / stepsFromGroups', () => {
  it('defaults to one move per step, in draw order', () => {
    expect(groupsFromSteps(actions)).toEqual([
      { actionIds: ['a1'], durationMs: 700 },
      { actionIds: ['a2'], durationMs: 700 },
    ]);
  });

  it('stores nothing when the arrangement is the default', () => {
    expect(
      stepsFromGroups(
        [
          { actionIds: ['a1'], durationMs: 700 },
          { actionIds: ['a2'], durationMs: 700 },
        ],
        actions,
      ),
    ).toEqual([]);
  });

  it('stores the steps once moves are grouped or retimed', () => {
    expect(
      stepsFromGroups([{ actionIds: ['a1', 'a2'], durationMs: 700 }], actions),
    ).toEqual([{ id: 'g0', actionIds: ['a1', 'a2'], durationMs: 700 }]);
  });
});

describe('ActionTimeline', () => {
  it('shows the phase header, the timeline label and the play button', () => {
    render(<ActionTimeline {...base} />);

    expect(
      screen.getByRole('heading', { name: 'Phase 1' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/action timeline/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /play full animation/i }),
    ).toBeInTheDocument();
  });

  it('toggles the show-title checkbox', async () => {
    const user = userEvent.setup();
    const onShowTitleChange = vi.fn();
    render(<ActionTimeline {...base} onShowTitleChange={onShowTitleChange} />);

    await user.click(screen.getByLabelText(/show title in animation/i));
    expect(onShowTitleChange).toHaveBeenCalledWith(true);
  });

  it('groups two moves together with "Run with step above"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActionTimeline {...base} onChange={onChange} />);

    // the pass is step 2 by default; merge it up into step 1
    await user.click(
      screen.getAllByRole('button', { name: 'Timing options' })[1],
    );
    await user.click(
      screen.getByRole('button', { name: 'Run with step above' }),
    );

    expect(onChange).toHaveBeenCalledWith([
      { id: 'g0', actionIds: ['a1', 'a2'], durationMs: 700 },
    ]);
  });

  it('splits a grouped move back out with "Run on its own"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ActionTimeline
        {...base}
        steps={[{ id: 'g0', actionIds: ['a1', 'a2'], durationMs: 700 }]}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getAllByRole('button', { name: 'Timing options' })[1],
    );
    await user.click(screen.getByRole('button', { name: 'Run on its own' }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('merges a move on a drop onto another card', () => {
    const onChange = vi.fn();
    render(<ActionTimeline {...base} onChange={onChange} />);

    fireEvent.dragStart(screen.getByText('Pass by Player 1'));
    fireEvent.drop(screen.getByText('Dribble by Player 1'));

    expect(onChange).toHaveBeenCalledWith([
      { id: 'g0', actionIds: ['a1', 'a2'], durationMs: 700 },
    ]);
  });

  it('changes a step duration from the kebab menu', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActionTimeline {...base} onChange={onChange} />);

    await user.click(
      screen.getAllByRole('button', { name: 'Timing options' })[0],
    );
    await user.click(screen.getByRole('button', { name: /Fast/ }));

    expect(onChange).toHaveBeenCalledWith([
      { id: 'g0', actionIds: ['a1'], durationMs: 400 },
      { id: 'g1', actionIds: ['a2'], durationMs: 700 },
    ]);
  });

  it('removes an action from the kebab menu', async () => {
    const user = userEvent.setup();
    const onRemoveAction = vi.fn();
    render(<ActionTimeline {...base} onRemoveAction={onRemoveAction} />);

    await user.click(
      screen.getAllByRole('button', { name: 'Timing options' })[0],
    );
    await user.click(screen.getByRole('button', { name: 'Remove action' }));

    expect(onRemoveAction).toHaveBeenCalledWith('a1');
  });

  it('runs the whole animation from the play button', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    render(<ActionTimeline {...base} onPlay={onPlay} />);

    await user.click(
      screen.getByRole('button', { name: /play full animation/i }),
    );
    expect(onPlay).toHaveBeenCalledOnce();
  });
});
