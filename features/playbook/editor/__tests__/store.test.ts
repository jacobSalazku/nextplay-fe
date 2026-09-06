import { seedDiagram } from '../seed-diagram';
import { usePlayEditor } from '../store';
import type { PlacedObject } from '@/features/playbook/diagram/types';
import { beforeEach, describe, expect, it } from 'vitest';

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 },
  { id: 'o2', kind: 'offense', label: '2', x: 20, y: 55 },
];

const hydrate = () =>
  usePlayEditor.getState().hydrate({
    playId: 'play-1',
    routeKey: 'team-slug~abc',
    name: 'Horns',
    diagram: seedDiagram('half', objects),
  });

beforeEach(() => usePlayEditor.getState().reset());

describe('usePlayEditor', () => {
  it('loads a play into a clean, not-dirty state', () => {
    // Act
    hydrate();

    // Assert
    const s = usePlayEditor.getState();
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
    usePlayEditor.getState().moveObject('o1', 10, 90);

    // Assert
    const { phase, isDirty } = usePlayEditor.getState();
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
    usePlayEditor.getState().select('o2');

    // Assert
    expect(usePlayEditor.getState().selectedId).toBe('o2');
  });

  it('clears the dirty flag once saved', () => {
    // Arrange
    hydrate();
    usePlayEditor.getState().moveObject('o1', 1, 1);

    // Act
    usePlayEditor.getState().markSaving();
    usePlayEditor.getState().markSaved();

    // Assert
    const s = usePlayEditor.getState();
    expect(s.status).toBe('idle');
    expect(s.isDirty).toBe(false);
  });

  it('serialises the working phase back into a v1 diagram', () => {
    // Arrange
    hydrate();
    usePlayEditor.getState().moveObject('o1', 33, 33);

    // Act
    const diagram = usePlayEditor.getState().toDiagram();

    // Assert
    expect(diagram.version).toBe(1);
    expect(diagram.court).toBe('half');
    expect(diagram.phases).toHaveLength(1);
    expect(diagram.phases[0].objects[0]).toMatchObject({ x: 33, y: 33 });
  });

  it('reset returns to the initial state', () => {
    // Arrange
    hydrate();
    usePlayEditor.getState().moveObject('o1', 5, 5);

    // Act
    usePlayEditor.getState().reset();

    // Assert
    const s = usePlayEditor.getState();
    expect(s.hydrated).toBe(false);
    expect(s.playId).toBe('');
    expect(s.isDirty).toBe(false);
  });
});
