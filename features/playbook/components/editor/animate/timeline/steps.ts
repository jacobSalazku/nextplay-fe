import type { Action, Step } from '@/features/playbook/utils/diagram/types';

export const DEFAULT_MS = 700;

export const DURATIONS = [
  { ms: 400, label: 'Fast' },
  { ms: 700, label: 'Normal' },
  { ms: 1200, label: 'Slow' },
];

// A step being edited: the moves that run together and how long they take.
export type Group = { actionIds: string[]; durationMs: number };

// No timeline yet ⇒ each move on its own step, in draw order (they play one
// after another). Otherwise each step is a group, with any newly-drawn move
// appended on its own step so it stays visible.
export function groupsFromSteps(actions: Action[], steps?: Step[]): Group[] {
  const ids = actions.map((a) => a.id);
  if (!steps || steps.length === 0) {
    return ids.map((id) => ({ actionIds: [id], durationMs: DEFAULT_MS }));
  }

  const groups = steps
    .map((s) => ({
      actionIds: s.actionIds.filter((id) => ids.includes(id)),
      durationMs: s.durationMs,
    }))
    .filter((g) => g.actionIds.length > 0);

  const placed = new Set(groups.flatMap((g) => g.actionIds));
  for (const id of ids) {
    if (!placed.has(id))
      groups.push({ actionIds: [id], durationMs: DEFAULT_MS });
  }

  return groups;
}

// The default — one move per step, in the drawn order — is stored as nothing.
export function stepsFromGroups(groups: Group[], actions: Action[]): Step[] {
  const clean = groups.filter((g) => g.actionIds.length > 0);

  const isDefault =
    clean.length === actions.length &&
    clean.every(
      (g, i) =>
        g.actionIds.length === 1 &&
        g.actionIds[0] === actions[i]?.id &&
        g.durationMs === DEFAULT_MS,
    );
  if (isDefault) return [];

  return clean.map((g, i) => ({
    id: `g${i}`,
    actionIds: g.actionIds,
    durationMs: g.durationMs,
  }));
}

const withoutAction = (groups: Group[], id: string): Group[] =>
  groups.map((g) => ({
    ...g,
    actionIds: g.actionIds.filter((x) => x !== id),
  }));

// Move `id` into step `step` — it now runs together with whatever is there.
export function moveToStep(groups: Group[], id: string, step: number): Group[] {
  const next = withoutAction(groups, id);
  if (next[step]) {
    next[step] = { ...next[step], actionIds: [...next[step].actionIds, id] };
  }
  return next;
}

// Move `id` onto its own new step at position `at`.
export function splitToStep(groups: Group[], id: string, at: number): Group[] {
  const from = groups.findIndex((g) => g.actionIds.includes(id));
  const next = withoutAction(groups, id);
  // pulling the move may have emptied a step before the drop point
  const shift = from !== -1 && from < at && next[from].actionIds.length === 0;
  next.splice(shift ? at - 1 : at, 0, {
    actionIds: [id],
    durationMs: DEFAULT_MS,
  });
  return next;
}

export const retimeStep = (
  groups: Group[],
  step: number,
  ms: number,
): Group[] => groups.map((g, i) => (i === step ? { ...g, durationMs: ms } : g));
