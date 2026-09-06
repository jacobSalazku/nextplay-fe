import { usePlayEditorStore } from '../use-play-editor-store';
import type { PlacedObject } from '@/features/playbook/diagram/types';
import { seedDiagram } from '@/features/playbook/editor/seed-diagram';
import { beforeEach, describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 },
  { id: 'o2', kind: 'offense', label: '2', x: 20, y: 55 },
];

const hydrate = () =>
  usePlayEditorStore.getState().hydrate({
    playId: 'play-1',
    routeKey: 'team-slug~abc',
    name: 'Horns',
    diagram: seedDiagram('half', objects),
  });

beforeEach(() => usePlayEditorStore.getState().reset());

describe('usePlayEditorStore', () => {
  it('loads a play into a clean, not-dirty state', () => {
    // Act
    hydrate();

    // Assert
    const s = usePlayEditorStore.getState();
    expect(s.hydrated).toBe(true);
    expect(s.name).toBe('Horns');
    expect(s.court).toBe('half');
    expect(s.phase.objects).toHaveLength(2);
    expect(s.isDirty).toBe(false);
  });

  it('moves one token and marks the play dirty', () => {
    // Arrange
    hydrate();

    // Act
    usePlayEditorStore.getState().moveObject('o1', 10, 90);

    // Assert
    const { phase, isDirty } = usePlayEditorStore.getState();
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

  it('tracks selection', () => {
    // Act
    usePlayEditorStore.getState().select('o2');

    // Assert
    expect(usePlayEditorStore.getState().selectedId).toBe('o2');
  });

  it('clears the dirty flag once saved', () => {
    // Arrange
    hydrate();
    usePlayEditorStore.getState().moveObject('o1', 1, 1);

    // Act
    usePlayEditorStore.getState().markSaving();
    usePlayEditorStore.getState().markSaved();

    // Assert
    const s = usePlayEditorStore.getState();
    expect(s.status).toBe('idle');
    expect(s.isDirty).toBe(false);
  });

  it('serialises the working phase back into a v1 diagram', () => {
    // Arrange
    hydrate();
    usePlayEditorStore.getState().moveObject('o1', 33, 33);

    // Act
    const diagram = usePlayEditorStore.getState().toDiagram();

    // Assert
    expect(diagram.version).toBe(1);
    expect(diagram.court).toBe('half');
    expect(diagram.phases).toHaveLength(1);
    expect(diagram.phases[0].objects[0]).toMatchObject({ x: 33, y: 33 });
  });

  it('reset returns to the initial state', () => {
    // Arrange
    hydrate();
    usePlayEditorStore.getState().moveObject('o1', 5, 5);

    // Act
    usePlayEditorStore.getState().reset();

    // Assert
    const s = usePlayEditorStore.getState();
    expect(s.hydrated).toBe(false);
    expect(s.playId).toBe('');
    expect(s.isDirty).toBe(false);
  });
});
