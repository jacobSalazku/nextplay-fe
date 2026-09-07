import {
  actionLabel,
  groupsFromSteps,
  SequenceGroups,
  stepsFromGroups,
} from '../components/editor/animate/sequence-groups';
import type { Action, PlacedObject } from '../utils/diagram/types';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 20, y: 80 },
  { id: 'o2', kind: 'offense', label: '2', x: 60, y: 40 },
];

const actions: Action[] = [
  { id: 'a1', type: 'pass', fromId: 'o1', toId: 'o2' },
  { id: 'a2', type: 'cut', fromId: 'o2', toId: 'o1' },
];

const base = {
  transitionLabel: 'Phase 1 → 2',
  actions,
  objects,
  onChange: vi.fn(),
};

describe('groupsFromSteps / stepsFromGroups', () => {
  it('treats no timeline as a single all-at-once group', () => {
    expect(groupsFromSteps(actions)).toEqual([
      { actionIds: ['a1', 'a2'], durationMs: 700 },
    ]);
  });

  it('round-trips a two-group timeline', () => {
    const steps = [
      { id: 'g0', actionIds: ['a1'], durationMs: 400 },
      { id: 'g1', actionIds: ['a2'], durationMs: 700 },
    ];
    const groups = groupsFromSteps(actions, steps);
    expect(groups).toEqual([
      { actionIds: ['a1'], durationMs: 400 },
      { actionIds: ['a2'], durationMs: 700 },
    ]);
    expect(stepsFromGroups(groups, 2)).toEqual(steps);
  });

  it('collapses a single group holding everything back to no timeline', () => {
    expect(
      stepsFromGroups([{ actionIds: ['a1', 'a2'], durationMs: 700 }], 2),
    ).toEqual([]);
  });

  it('appends an unscripted move to a trailing group', () => {
    const groups = groupsFromSteps(actions, [
      { id: 'g0', actionIds: ['a1'], durationMs: 400 },
    ]);
    expect(groups).toEqual([
      { actionIds: ['a1'], durationMs: 400 },
      { actionIds: ['a2'], durationMs: 700 },
    ]);
  });
});

describe('actionLabel', () => {
  it('reads out the players involved', () => {
    expect(actionLabel(actions[0], objects)).toBe('1 passes to 2');
    expect(actionLabel({ id: 'a', type: 'cut', fromId: 'o1' }, objects)).toBe(
      '1 cuts',
    );
  });
});

describe('SequenceGroups', () => {
  it('shows one "Together" group for an unsequenced phase', () => {
    render(<SequenceGroups {...base} />);

    expect(screen.getByText(/all at once/i)).toBeInTheDocument();
    expect(screen.getByText('1 passes to 2')).toBeInTheDocument();
    expect(screen.getByText('2 cuts 1')).toBeInTheDocument();
  });

  it('sets a group timing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SequenceGroups
        {...base}
        steps={[
          { id: 'g0', actionIds: ['a1'], durationMs: 700 },
          { id: 'g1', actionIds: ['a2'], durationMs: 700 },
        ]}
        onChange={onChange}
      />,
    );

    const timing = screen.getByRole('group', { name: 'Timing for group 1' });
    await user.click(within(timing).getByRole('button', { name: 'Fast' }));

    expect(onChange).toHaveBeenCalledWith([
      { id: 'g0', actionIds: ['a1'], durationMs: 400 },
      { id: 'g1', actionIds: ['a2'], durationMs: 700 },
    ]);
  });

  it('splits a move into a new group on drop', () => {
    const onChange = vi.fn();
    render(<SequenceGroups {...base} onChange={onChange} />);

    fireEvent.dragStart(screen.getByText('2 cuts 1'));
    fireEvent.drop(screen.getByLabelText('New group'));

    expect(onChange).toHaveBeenCalledWith([
      { id: 'g0', actionIds: ['a1'], durationMs: 700 },
      { id: 'g1', actionIds: ['a2'], durationMs: 700 },
    ]);
  });

  it('merges a move back into an existing group on drop', () => {
    const onChange = vi.fn();
    render(
      <SequenceGroups
        {...base}
        steps={[
          { id: 'g0', actionIds: ['a1'], durationMs: 700 },
          { id: 'g1', actionIds: ['a2'], durationMs: 700 },
        ]}
        onChange={onChange}
      />,
    );

    fireEvent.dragStart(screen.getByText('2 cuts 1'));
    fireEvent.drop(screen.getByLabelText('Group 1'));

    // one group with everything => no timeline
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
