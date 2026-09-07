import type {
  Action,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';

const VERB: Record<Action['type'], string> = {
  pass: 'Pass',
  dribble: 'Dribble',
  cut: 'Cut',
  screen: 'Screen',
  shot: 'Shot',
  handoff: 'Handoff',
};

// e.g. "Dribble by Player 1", "Screen by Defender 3"
export function actionLabel(action: Action, objects: PlacedObject[]): string {
  const who = objects.find((o) => o.id === action.fromId);
  const role = who?.kind === 'defense' ? 'Defender' : 'Player';
  return `${VERB[action.type]} by ${role} ${who?.label ?? '?'}`;
}

export const durationLabel = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
