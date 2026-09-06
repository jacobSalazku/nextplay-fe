import type {
  CourtType,
  PlacedObject,
  PlayDiagram,
} from '@/features/playbook/utils/diagram/types';

// A formation preset's `objects` arrives as an untyped JSON scalar from the
// backend; it was built there from PlacedObject, so a shape check is enough.
export function toFormationObjects(value: unknown): PlacedObject[] {
  return Array.isArray(value) ? (value as PlacedObject[]) : [];
}

// The starting diagram for a new play: one phase holding the chosen
// formation's tokens, no actions, no timeline yet.
export function seedDiagram(
  court: CourtType,
  objects: PlacedObject[],
): PlayDiagram {
  return {
    version: 1,
    court,
    phases: [{ id: 'p1', objects, actions: [] }],
    timeline: [],
  };
}
