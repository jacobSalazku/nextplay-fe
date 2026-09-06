import { usePlayEditorStore } from '../use-play-editor-store';
import type { PlacedObject } from '@/features/playbook/diagram/types';
import { seedDiagram } from '@/features/playbook/editor/seed-diagram';
import { beforeEach, describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 },
  { id: 'o2', kind: 'offense', label: '2', x: 20, y: 55 },
  { id: 'x1', kind: 'defense', label: 'x1', x: 50, y: 70 },
];

const store = () => usePlayEditorStore.getState();

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
    expect(s.phase.objects).toHaveLength(3);
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
    const { phase, isDirty } = store();
    expect(phase.objects.find((o) => o.id === 'o1')).toMatchObject({
      x: 10,
      y: 90,
    });
    expect(phase.objects.find((o) => o.id === 'o2')).toMatchObject({
      x: 20,
      y: 55,
    });
    expect(isDirty).toBe(true);
  });

  it('rotates a defender', () => {
    // Arrange
    hydrate();

    // Act
    store().rotateObject('x1', 135);

    // Assert
    expect(store().phase.objects.find((o) => o.id === 'x1')?.facing).toBe(135);
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
    const [action] = store().phase.actions;
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
    expect(store().phase.actions).toHaveLength(30);
  });

  it('bends and un-bends an action', () => {
    // Arrange
    hydrate();
    store().addAction({ type: 'cut', fromId: 'o1', toPoint: { x: 40, y: 40 } });
    const { id } = store().phase.actions[0];

    // Act — bend
    store().updateAction(id, { bend: { x: 5, y: -8 } });

    // Assert
    expect(store().phase.actions[0].bend).toEqual({ x: 5, y: -8 });

    // Act — straighten
    store().updateAction(id, { bend: undefined });

    // Assert — the key is gone, not left as undefined
    expect('bend' in store().phase.actions[0]).toBe(false);
  });

  it('deletes an action and clears it from the selection', () => {
    // Arrange
    hydrate();
    store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });
    const { id } = store().phase.actions[0];

    // Act
    store().deleteAction(id);

    // Assert
    expect(store().phase.actions).toHaveLength(0);
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
