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
  pass: '1.3 1.1',
  shot: '0.3 1.4',
};

type RouteProps = {
  action: Action;
  objects: PlacedObject[];
};

export function Route({ action, objects }: RouteProps) {
  const ends = actionEndpoints(action, objects);
  if (!ends) return null;

  const d = routePath(action.type, ends.a, ends.b, ends.ctrl);

  return (
    <path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={0.45}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={DASH[action.type]}
      markerEnd={
        ARROW_ACTIONS.has(action.type) ? 'url(#route-arrow)' : undefined
      }
    />
  );
}
