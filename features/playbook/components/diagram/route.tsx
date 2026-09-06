import {
  actionEndpoints,
  ARROW_ACTIONS,
  routePath,
} from '@/features/playbook/utils/diagram/geometry';
import type {
  Action,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';

const INK = '#1E1B16';

const DASH: Partial<Record<Action['type'], string>> = {
  pass: '2 1.6',
  shot: '0.4 1.8',
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
      strokeWidth={0.6}
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
      markerWidth="3"
      markerHeight="3"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L8 4 L0 8 Z" fill={INK} />
    </marker>
  );
}
