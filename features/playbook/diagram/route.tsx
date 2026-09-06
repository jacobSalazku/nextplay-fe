import { actionEndpoints, ARROW_ACTIONS, routePath } from './geometry';
import type { Action, PlacedObject } from './types';

const INK = '#1E1B16';

const DASH: Partial<Record<Action['type'], string>> = {
  pass: '3 2',
  shot: '0.5 2.2',
};

export function Route({
  action,
  objects,
}: {
  action: Action;
  objects: PlacedObject[];
}) {
  const ends = actionEndpoints(action, objects);
  if (!ends) return null;

  const d = routePath(action.type, ends.a, ends.b, ends.ctrl);

  return (
    <path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={0.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={DASH[action.type]}
      markerEnd={
        ARROW_ACTIONS.has(action.type) ? 'url(#route-arrow)' : undefined
      }
    />
  );
}

export function RouteArrowMarker() {
  return (
    <marker
      id="route-arrow"
      viewBox="0 0 8 8"
      refX="6"
      refY="4"
      markerWidth="4"
      markerHeight="4"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L8 4 L0 8 Z" fill={INK} />
    </marker>
  );
}
