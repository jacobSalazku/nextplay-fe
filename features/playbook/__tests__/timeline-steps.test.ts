import { actionLabel } from '../components/editor/animate/timeline/labels';
import {
  groupsFromSteps,
  moveToStep,
  reorderGroup,
  splitToStep,
  stepsFromGroups,
} from '../components/editor/animate/timeline/steps';
import type { Action, PlacedObject } from '../utils/diagram/types';
import { describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 20, y: 80 },
  { id: 'x1', kind: 'defense', label: '3', x: 60, y: 40 },
];

const actions: Action[] = [
  { id: 'a1', type: 'dribble', fromId: 'o1', toPoint: { x: 40, y: 40 } },
  { id: 'a2', type: 'pass', fromId: 'o1', toId: 'x1' },
];

describe('labels', () => {
  it('names the move, the role and the player', () => {
    expect(actionLabel(actions[0], objects)).toBe('Dribble by Player 1');
    expect(
      actionLabel({ id: 'a', type: 'screen', fromId: 'x1' }, objects),
    ).toBe('Screen by Defender 3');
  });
});

describe('groupsFromSteps / stepsFromGroups', () => {
  it('defaults to one move per step, in draw order', () => {
    expect(groupsFromSteps(actions)).toEqual([
      { actionIds: ['a1'], durationMs: 1000 },
      { actionIds: ['a2'], durationMs: 1000 },
    ]);
  });

  it('appends an unscripted move on its own step', () => {
    expect(
      groupsFromSteps(actions, [
        { id: 'g0', actionIds: ['a1'], durationMs: 400 },
      ]),
    ).toEqual([
      { actionIds: ['a1'], durationMs: 400 },
      { actionIds: ['a2'], durationMs: 1000 },
    ]);
  });

  it('stores nothing for the default arrangement', () => {
    expect(stepsFromGroups(groupsFromSteps(actions), actions)).toEqual([]);
  });

  it('stores the steps once moves are grouped', () => {
    expect(
      stepsFromGroups([{ actionIds: ['a1', 'a2'], durationMs: 1000 }], actions),
    ).toEqual([{ id: 'g0', actionIds: ['a1', 'a2'], durationMs: 1000 }]);
  });
});

describe('group edits', () => {
  const groups = groupsFromSteps(actions);

  it('moves a move into another step', () => {
    expect(moveToStep(groups, 'a2', 0)).toEqual([
      { actionIds: ['a1', 'a2'], durationMs: 1000 },
      { actionIds: [], durationMs: 1000 },
    ]);
  });

  it('splits a move onto its own step', () => {
    const grouped = [{ actionIds: ['a1', 'a2'], durationMs: 1000 }];
    expect(splitToStep(grouped, 'a2', 1)).toEqual([
      { actionIds: ['a1'], durationMs: 1000 },
      { actionIds: ['a2'], durationMs: 1000 },
    ]);
  });

  it('reorders a step and leaves an out-of-range move a no-op', () => {
    expect(reorderGroup(groups, 0, 1)).toEqual([
      { actionIds: ['a2'], durationMs: 1000 },
      { actionIds: ['a1'], durationMs: 1000 },
    ]);
    expect(reorderGroup(groups, 0, 5)).toBe(groups);
  });
});
