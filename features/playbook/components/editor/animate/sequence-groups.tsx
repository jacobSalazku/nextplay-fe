'use client';

import { useRef } from 'react';
import type {
  Action,
  PlacedObject,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';

const DURATIONS = [
  { ms: 400, label: 'Fast' },
  { ms: 700, label: 'Normal' },
  { ms: 1200, label: 'Slow' },
];
const DEFAULT_MS = 700;

const VERB: Record<Action['type'], string> = {
  pass: 'passes to',
  dribble: 'dribbles',
  cut: 'cuts',
  screen: 'screens',
  shot: 'shoots',
  handoff: 'hands to',
};

export function actionLabel(action: Action, objects: PlacedObject[]): string {
  const name = (id: string) => objects.find((o) => o.id === id)?.label ?? '?';
  const to = action.toId ? ` ${name(action.toId)}` : '';
  return `${name(action.fromId)} ${VERB[action.type]}${to}`;
}

export type Group = { actionIds: string[]; durationMs: number };

// A phase with no timeline is one group: everything at once. Otherwise each
// step is a group, with any newly-drawn (unscripted) move appended to a last
// group so it stays visible.
export function groupsFromSteps(actions: Action[], steps?: Step[]): Group[] {
  const ids = actions.map((a) => a.id);
  if (!steps || steps.length === 0) {
    return ids.length ? [{ actionIds: ids, durationMs: DEFAULT_MS }] : [];
  }

  const groups = steps
    .map((s) => ({
      actionIds: s.actionIds.filter((id) => ids.includes(id)),
      durationMs: s.durationMs,
    }))
    .filter((g) => g.actionIds.length > 0);

  const placed = new Set(groups.flatMap((g) => g.actionIds));
  const extra = ids.filter((id) => !placed.has(id));
  if (extra.length) groups.push({ actionIds: extra, durationMs: DEFAULT_MS });

  return groups;
}

// One group holding every move is "play together" — store no timeline at all.
export function stepsFromGroups(groups: Group[], actionCount: number): Step[] {
  const clean = groups.filter((g) => g.actionIds.length > 0);
  if (clean.length <= 1 && (clean[0]?.actionIds.length ?? 0) === actionCount) {
    return [];
  }
  return clean.map((g, i) => ({
    id: `g${i}`,
    actionIds: g.actionIds,
    durationMs: g.durationMs,
  }));
}

type Props = {
  transitionLabel: string;
  actions: Action[];
  objects: PlacedObject[];
  steps?: Step[];
  onChange: (steps: Step[]) => void;
};

export function SequenceGroups({
  transitionLabel,
  actions,
  objects,
  steps,
  onChange,
}: Props) {
  const dragId = useRef<string | null>(null);
  const groups = groupsFromSteps(actions, steps);
  const sequenced = groups.length > 1;

  const commit = (next: Group[]) =>
    onChange(stepsFromGroups(next, actions.length));

  // target === groups.length means "a new group at the end"
  const moveTo = (actionId: string, target: number) => {
    const next = groups.map((g) => ({
      ...g,
      actionIds: g.actionIds.filter((id) => id !== actionId),
    }));
    if (target >= next.length) {
      next.push({ actionIds: [actionId], durationMs: DEFAULT_MS });
    } else {
      next[target] = {
        ...next[target],
        actionIds: [...next[target].actionIds, actionId],
      };
    }
    commit(next);
  };

  const setDuration = (group: number, ms: number) =>
    commit(groups.map((g, i) => (i === group ? { ...g, durationMs: ms } : g)));

  const allowDrop = (event: React.DragEvent) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const target = Number(event.currentTarget.dataset.groupTarget);
    if (dragId.current) moveTo(dragId.current, target);
    dragId.current = null;
  };

  const subtitle =
    groups.length === 0
      ? 'No moves drawn'
      : sequenced
        ? `${groups.length} groups, in order`
        : 'All moves at once';

  return (
    <section
      aria-label="Sequence"
      className="flex w-72 shrink-0 flex-col rounded-lg border border-white/10 bg-slate-900"
    >
      <header className="border-b border-white/10 px-3 py-2.5">
        <p className="text-[13px] font-semibold text-gray-100">
          {transitionLabel}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
        {groups.map((group, gi) => (
          <div key={gi}>
            <div
              aria-label={`Group ${gi + 1}`}
              data-group-target={gi}
              onDragOver={allowDrop}
              onDrop={handleDrop}
              className="flex flex-col gap-2 rounded-md border border-white/10 bg-white/[0.04] p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">
                  {sequenced ? `Group ${gi + 1}` : 'Together'}
                </span>
                <div
                  role="group"
                  aria-label={`Timing for group ${gi + 1}`}
                  className="flex gap-0.5 rounded border border-white/10 p-0.5 text-[11px]"
                >
                  {DURATIONS.map((d) => (
                    <button
                      key={d.ms}
                      type="button"
                      aria-pressed={group.durationMs === d.ms}
                      onClick={() => setDuration(gi, d.ms)}
                      className={cn(
                        'cursor-pointer rounded px-1.5 py-0.5 transition',
                        group.durationMs === d.ms
                          ? 'bg-slate-700 text-white'
                          : 'text-gray-400 hover:text-white',
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="flex flex-wrap gap-1.5">
                {group.actionIds.map((id) => {
                  const action = actions.find((a) => a.id === id);
                  if (!action) return null;
                  return (
                    <li
                      key={id}
                      draggable
                      onDragStart={() => (dragId.current = id)}
                      onDragEnd={() => (dragId.current = null)}
                      className="cursor-grab rounded bg-slate-700 px-2 py-1 text-[13px] text-gray-100 active:cursor-grabbing"
                    >
                      {actionLabel(action, objects)}
                    </li>
                  );
                })}
              </ul>
            </div>

            {gi < groups.length - 1 && (
              <div className="flex items-center gap-2 px-1 py-1.5">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-medium tracking-wide text-gray-600 uppercase">
                  then
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            )}
          </div>
        ))}

        {groups.length === 0 && (
          <p className="px-1 text-xs text-gray-500">
            Draw moves in this phase to sequence them.
          </p>
        )}

        {groups.length > 0 && (
          <div
            aria-label="New group"
            data-group-target={groups.length}
            onDragOver={allowDrop}
            onDrop={handleDrop}
            className="rounded-md border border-dashed border-white/15 px-3 py-4 text-center text-xs text-gray-500"
          >
            Drag a move here for a new group
          </div>
        )}
      </div>
    </section>
  );
}
