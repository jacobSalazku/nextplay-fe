import { ActionTimeline } from '../components/editor/animate/timeline/action-timeline';
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
  actions,
  objects,
  onChange: vi.fn(),
  onRemoveAction: vi.fn(),
};

const kebab = (i: number) =>
  screen.getAllByRole('button', { name: 'Timing options' })[i];

describe('ActionTimeline', () => {
  it('shows the phase header, the timeline label and the moves', () => {
    render(<ActionTimeline {...base} />);

    expect(
      screen.getByRole('heading', { name: 'Action timeline' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/action timeline/i)).toBeInTheDocument();
    expect(screen.getByText('Dribble by Player 1')).toBeInTheDocument();
    expect(screen.getByText('Pass by Player 1')).toBeInTheDocument();
  });

  it('groups two moves with "Run with step above"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActionTimeline {...base} onChange={onChange} />);

    await user.click(kebab(1));
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

    await user.click(kebab(1));
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

    await user.click(kebab(0));
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

    await user.click(kebab(0));
    await user.click(screen.getByRole('button', { name: 'Remove action' }));

    expect(onRemoveAction).toHaveBeenCalledWith('a1');
  });
});
