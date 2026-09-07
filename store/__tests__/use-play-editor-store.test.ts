import { usePlayEditorStore } from '../use-play-editor-store';
import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import { seedDiagram } from '@/features/playbook/utils/editor/seed-diagram';
import { beforeEach, describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 },
  { id: 'o2', kind: 'offense', label: '2', x: 20, y: 55 },
  { id: 'x1', kind: 'defense', label: 'x1', x: 50, y: 70 },
];

const store = () => usePlayEditorStore.getState();
const phase = () => store().phases[store().activePhaseIndex];

const hydrate = () =>
  store().hydrate({
    playId: 'play-1',
    routeKey: 'team-slug~abc',
    name: 'Horns',
    diagram: seedDiagram('half', objects),
  });

beforeEach(() => store().reset());

describe('usePlayEditorStore', () => {
  it('loads a play into a clean, not-dirty state', () => {
    hydrate();

    const s = store();
    expect(s.hydrated).toBe(true);
    expect(s.name).toBe('Horns');
    expect(s.court).toBe('half');
    expect(s.phases[0].objects).toHaveLength(3);
    expect(s.tool).toBe('select');
    expect(s.selection).toBeNull();
    expect(s.isDirty).toBe(false);
  });

  it('moves one token and marks the play dirty', () => {
    // Arrange
    hydrate();

    // Act
    store().moveObject('o1', 10, 90);

    // Assert
    expect(phase().objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 10,
      y: 90,
    });
    expect(phase().objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 20,
      y: 55,
    });
    expect(store().isDirty).toBe(true);
  });

  it('rotates a defender', () => {
    // Arrange
    hydrate();

    // Act
    store().rotateObject('x1', 135);

    // Assert
    expect(phase().objects.find((o) => o.id === 'x1')?.facing).toBe(135);
    expect(store().isDirty).toBe(true);
  });

  it('picking a tool clears the selection', () => {
    // Arrange
    store().select({ kind: 'object', id: 'o2' });

    // Act
    store().setTool('pass');

    // Assert
    expect(store().tool).toBe('pass');
    expect(store().selection).toBeNull();
  });

  it('adds an action with a generated id and selects it', () => {
    // Arrange
    hydrate();

    // Act
    const ok = store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });

    // Assert
    const [action] = phase().actions;
    expect(ok).toBe(true);
    expect(action).toMatchObject({ type: 'pass', fromId: 'o1', toId: 'o2' });
    expect(action.id).toMatch(/^a/);
    expect(store().selection).toEqual({ kind: 'action', id: action.id });
    expect(store().isDirty).toBe(true);
  });

  it('refuses a 31st action', () => {
    // Arrange
    hydrate();
    for (let i = 0; i < 30; i++) {
      store().addAction({ type: 'cut', fromId: 'o1', toPoint: { x: i, y: i } });
    }

    // Act
    const ok = store().addAction({
      type: 'cut',
      fromId: 'o1',
      toPoint: { x: 1, y: 1 },
    });

    // Assert
    expect(ok).toBe(false);
    expect(phase().actions).toHaveLength(30);
  });

  it('bends and un-bends an action', () => {
    // Arrange
    hydrate();
    store().addAction({ type: 'cut', fromId: 'o1', toPoint: { x: 40, y: 40 } });
    const { id } = phase().actions[0];

    // Act — bend
    store().updateAction(id, { bend: { x: 5, y: -8 } });

    // Assert
    expect(phase().actions[0].bend).toEqual({ x: 5, y: -8 });

    // Act — straighten
    store().updateAction(id, { bend: undefined });

    // Assert — the key is gone, not left as undefined
    expect('bend' in phase().actions[0]).toBe(false);
  });

  it('deletes an action and clears it from the selection', () => {
    // Arrange
    hydrate();
    store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });
    const { id } = phase().actions[0];

    // Act
    store().deleteAction(id);

    // Assert
    expect(phase().actions).toHaveLength(0);
    expect(store().selection).toBeNull();
  });

  it('clears the dirty flag once saved', () => {
    // Arrange
    hydrate();
    store().moveObject('o1', 1, 1);

    // Act
    store().markSaved();

    // Assert
    expect(store().isDirty).toBe(false);
  });

  it('serialises the working phase back into a v1 diagram', () => {
    // Arrange
    hydrate();
    store().moveObject('o1', 33, 33);
    store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });

    // Act
    const diagram = store().toDiagram();

    // Assert
    expect(diagram.version).toBe(1);
    expect(diagram.phases[0].objects[0]).toMatchObject({ x: 33, y: 33 });
    expect(diagram.phases[0].actions).toHaveLength(1);
  });

  it('benches a player, dropping its routes and the ball', () => {
    // Arrange
    hydrate();
    store().setBallHolder('o1');
    store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });

    // Act
    store().benchObject('o1');

    // Assert
    expect(phase().objects.some((o) => o.id === 'o1')).toBe(false);
    expect(phase().actions).toHaveLength(0);
    expect(phase().ballHolderId).toBeUndefined();
  });

  it('un-benches a player back at its formation spot', () => {
    // Arrange — o2 was seeded at (20, 55)
    hydrate();
    store().benchObject('o2');

    // Act
    store().unbenchObject('o2');

    // Assert
    expect(phase().objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 20,
      y: 55,
    });
  });

  it('un-benches a fresh slot at its role home', () => {
    // Arrange — o3 was never on court
    hydrate();

    // Act
    store().unbenchObject('o3');

    // Assert — a real spot, not (0,0)
    const o3 = phase().objects.find((o) => o.id === 'o3');
    expect(o3!.x).toBeGreaterThan(0);
    expect(o3!.y).toBeGreaterThan(0);
  });

  it('adds a sixth player with the + slot and caps there', () => {
    // Arrange
    hydrate();

    // Act
    store().addSlot('offense');

    // Assert
    expect(phase().objects.some((o) => o.id === 'o6')).toBe(true);
    expect(store().rosterCount.offense).toBe(6);

    // Act — push past the cap
    store().addSlot('offense'); // refused

    // Assert
    expect(store().rosterCount.offense).toBe(6);
  });

  it('matches every attacker man-to-man', () => {
    // Arrange — hydrate has o1, o2 (and x1)
    hydrate();

    // Act
    store().matchManToMan();

    // Assert — a defender for o2, x1 already there
    const defenders = phase()
      .objects.filter((o) => o.kind === 'defense')
      .map((o) => o.id);
    expect(defenders).toContain('x1');
    expect(defenders).toContain('x2');
  });

  it('toggles ball possession', () => {
    // Arrange
    hydrate();

    // Act / Assert
    store().setBallHolder('o1');
    expect(phase().ballHolderId).toBe('o1');

    store().setBallHolder('o1');
    expect(phase().ballHolderId).toBeUndefined();
  });

  it('undoes and redoes a discrete edit', () => {
    // Arrange
    hydrate();
    store().benchObject('o1');

    // Act — undo
    store().undo();

    // Assert — o1 is back
    expect(phase().objects.some((o) => o.id === 'o1')).toBe(true);

    // Act — redo
    store().redo();

    // Assert — gone again
    expect(phase().objects.some((o) => o.id === 'o1')).toBe(false);
  });

  it('collapses a drag into a single undo step', () => {
    // Arrange
    hydrate();
    const start = phase().objects.find((o) => o.id === 'o1');

    // Act — one drag: arm once, move several times
    store().beginEdit();
    store().moveObject('o1', 10, 10);
    store().moveObject('o1', 20, 20);
    store().moveObject('o1', 30, 30);
    store().endEdit();

    store().undo();

    // Assert — back to where the drag started, in one step
    expect(phase().objects.find((o) => o.id === 'o1')).toMatchObject({
      x: start!.x,
      y: start!.y,
    });
  });

  it('drops undo history when the play is saved', () => {
    // Arrange
    hydrate();
    store().benchObject('o1');

    // Act
    store().markSaved();
    store().undo();

    // Assert — the save is a floor; o1 stays benched
    expect(phase().objects.some((o) => o.id === 'o1')).toBe(false);
  });

  it('adds a phase that copies the previous positions with no routes', () => {
    // Arrange
    hydrate();
    store().moveObject('o1', 11, 22);
    store().setBallHolder('o1');
    store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });

    // Act
    store().addPhase();

    // Assert — new phase active, same objects, no actions, ball carried over
    expect(store().phases).toHaveLength(2);
    expect(store().activePhaseIndex).toBe(1);
    expect(phase().objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 11,
      y: 22,
    });
    expect(phase().actions).toHaveLength(0);
    expect(phase().ballHolderId).toBe('o1');

    // and the first phase is untouched
    expect(store().phases[0].actions).toHaveLength(1);
  });

  it('edits only the active phase', () => {
    // Arrange
    hydrate();
    store().addPhase(); // active = 1

    // Act — move in phase 2 only
    store().moveObject('o1', 5, 5);

    // Assert
    expect(store().phases[0].objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 50,
      y: 80,
    });
    expect(store().phases[1].objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 5,
      y: 5,
    });
  });

  it('benches a player from every phase', () => {
    // Arrange
    hydrate();
    store().addPhase();
    store().setActivePhase(0);

    // Act
    store().benchObject('o1');

    // Assert
    expect(
      store().phases.every((p) => !p.objects.some((o) => o.id === 'o1')),
    ).toBe(true);
  });

  it('deletes a phase and clamps the active index', () => {
    // Arrange
    hydrate();
    store().addPhase();
    store().addPhase(); // 3 phases, active = 2

    // Act
    store().deletePhase(2);

    // Assert
    expect(store().phases).toHaveLength(2);
    expect(store().activePhaseIndex).toBe(1);

    // and the last phase can't be removed
    store().deletePhase(0);
    store().deletePhase(0);
    expect(store().phases).toHaveLength(1);
  });

  it('sets and clears a note on any phase, not just the active one', () => {
    // Arrange
    hydrate();
    store().addPhase(); // active = 1

    // Act — note the first (inactive) phase
    store().setPhaseNote(0, '  Iso for the 1  ');

    // Assert
    expect(store().phases[0].note).toBe('  Iso for the 1  ');
    expect('note' in store().phases[1]).toBe(false);

    // Act — clear it
    store().setPhaseNote(0, '');

    // Assert — the key is gone, not left as ''
    expect('note' in store().phases[0]).toBe(false);
  });

  it('collapses a note-editing session into one undo step', () => {
    // Arrange
    hydrate();

    // Act — arm once, type several times, blur
    store().beginEdit();
    store().setPhaseNote(0, 'H');
    store().setPhaseNote(0, 'Ho');
    store().setPhaseNote(0, 'Horns');
    store().endEdit();

    store().undo();

    // Assert — back to no note in one step
    expect('note' in store().phases[0]).toBe(false);
  });

  it('reorders phases and follows the active one', () => {
    // Arrange
    hydrate();
    store().addPhase();
    store().addPhase(); // active = 2
    const activeId = store().phases[2].id;

    // Act — move phase 2 to the front
    store().reorderPhase(2, 0);

    // Assert
    expect(store().phases[0].id).toBe(activeId);
    expect(store().activePhaseIndex).toBe(0);
  });

  it('undoes adding a phase', () => {
    // Arrange
    hydrate();
    store().addPhase();

    // Act
    store().undo();

    // Assert
    expect(store().phases).toHaveLength(1);
    expect(store().activePhaseIndex).toBe(0);
  });

  it('switching phases is not a history step', () => {
    // Arrange
    hydrate();
    store().addPhase();
    const historyLen = store().history.length;

    // Act
    store().setActivePhase(0);

    // Assert
    expect(store().history).toHaveLength(historyLen);
    expect(store().activePhaseIndex).toBe(0);
  });

  it('reset returns to the initial state', () => {
    // Arrange
    hydrate();
    store().moveObject('o1', 5, 5);
    store().setTool('screen');

    // Act
    store().reset();

    // Assert
    const s = store();
    expect(s.hydrated).toBe(false);
    expect(s.playId).toBe('');
    expect(s.tool).toBe('select');
    expect(s.isDirty).toBe(false);
  });
});
