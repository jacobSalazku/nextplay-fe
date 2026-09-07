'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  Action,
  PlacedObject,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';
import { GripVertical, MoreVertical, Play } from 'lucide-react';

const DURATIONS = [
  { ms: 400, label: 'Fast' },
  { ms: 700, label: 'Normal' },
  { ms: 1200, label: 'Slow' },
];
const DEFAULT_MS = 700;

const VERB: Record<Action['type'], string> = {
  pass: 'Pass',
  dribble: 'Dribble',
  cut: 'Cut',
  screen: 'Screen',
  shot: 'Shot',
  handoff: 'Handoff',
};

export function actionLabel(action: Action, objects: PlacedObject[]): string {
  const who = objects.find((o) => o.id === action.fromId);
  const role = who?.kind === 'defense' ? 'Defender' : 'Player';
  return `${VERB[action.type]} by ${role} ${who?.label ?? '?'}`;
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

export type Group = { actionIds: string[]; durationMs: number };

// No timeline yet ⇒ one step, everything at once. Otherwise each step is a
// group, with any newly-drawn move appended so it stays visible.
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

// One step holding every move is "all at once" — store no timeline at all.
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

function KebabMenu({
  durationMs,
  onDuration,
  onRemove,
}: {
  durationMs: number;
  onDuration: (ms: number) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Timing options"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded p-1 text-[#b9ac8e] transition hover:bg-black/5 hover:text-[#1f2d4d]"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-[#e6dcc4] bg-[#faf6ec] py-1 text-sm text-[#1f2d4d] shadow-lg">
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              type="button"
              onClick={() => {
                onDuration(d.ms);
                setOpen(false);
              }}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between px-3 py-1.5 hover:bg-black/5',
                d.ms === durationMs && 'font-semibold',
              )}
            >
              {d.label}
              <span className="font-mono text-xs text-[#a89372]">
                {seconds(d.ms)}
              </span>
            </button>
          ))}
          <div className="my-1 border-t border-[#e6dcc4]" />
          <button
            type="button"
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className="w-full cursor-pointer px-3 py-1.5 text-left text-red-700 hover:bg-black/5"
          >
            Remove action
          </button>
        </div>
      )}
    </div>
  );
}

type Props = {
  phaseNumber: number;
  actions: Action[];
  objects: PlacedObject[];
  steps?: Step[];
  showTitle: boolean;
  onShowTitleChange: (value: boolean) => void;
  onChange: (steps: Step[]) => void;
  onRemoveAction: (id: string) => void;
  onPlay: () => void;
};

export function ActionTimeline({
  phaseNumber,
  actions,
  objects,
  steps,
  showTitle,
  onShowTitleChange,
  onChange,
  onRemoveAction,
  onPlay,
}: Props) {
  const dragId = useRef<string | null>(null);
  const groups = groupsFromSteps(actions, steps);

  const commit = (next: Group[]) =>
    onChange(stepsFromGroups(next, actions.length));

  const stripped = (actionId: string) =>
    groups.map((g) => ({
      ...g,
      actionIds: g.actionIds.filter((id) => id !== actionId),
    }));

  const mergeIntoStep = (actionId: string, step: number) => {
    const next = stripped(actionId);
    if (next[step]) {
      next[step] = {
        ...next[step],
        actionIds: [...next[step].actionIds, actionId],
      };
    }
    commit(next);
  };

  const insertStepAt = (actionId: string, at: number) => {
    const fromStep = groups.findIndex((g) => g.actionIds.includes(actionId));
    const next = stripped(actionId);
    // if pulling the action emptied a step before the drop point, everything
    // after it shifts up one
    const shift =
      fromStep !== -1 && fromStep < at && next[fromStep].actionIds.length === 0;
    next.splice(shift ? at - 1 : at, 0, {
      actionIds: [actionId],
      durationMs: DEFAULT_MS,
    });
    commit(next);
  };

  const setDuration = (step: number, ms: number) =>
    commit(groups.map((g, i) => (i === step ? { ...g, durationMs: ms } : g)));

  const allowDrop = (event: React.DragEvent) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const id = dragId.current;
    dragId.current = null;
    if (!id) return;
    const { dropStep, dropGap } = event.currentTarget.dataset;
    if (dropStep != null) mergeIntoStep(id, Number(dropStep));
    else if (dropGap != null) insertStepAt(id, Number(dropGap));
  };

  const gap = (at: number) => (
    <div
      data-drop-gap={at}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      className="h-2"
    />
  );

  return (
    <section
      aria-label="Action timeline"
      className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-[#faf6ec] text-[#1f2d4d]"
    >
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold">Phase {phaseNumber}</h2>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[#4a4636]">
          <input
            type="checkbox"
            checked={showTitle}
            onChange={(e) => onShowTitleChange(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-[#c9bd9d] accent-[#1f2d4d]"
          />
          Show title in animation
        </label>
      </div>

      <div className="border-t border-[#e6dcc4]" />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="text-xs font-semibold tracking-wider text-[#a89372] uppercase">
          Action timeline
        </p>

        {groups.length === 0 ? (
          <p className="mt-3 text-sm text-[#6b6350]">
            Draw moves in this phase to sequence them.
          </p>
        ) : (
          <ol className="mt-2 flex flex-col">
            {groups.map((group, gi) => {
              const together = group.actionIds.length > 1;
              return (
                <li key={gi}>
                  {gap(gi)}
                  <p className="mb-1.5 pl-3 text-xs font-semibold tracking-wider text-[#a89372] uppercase">
                    Step {gi + 1}
                    {together && (
                      <span className="font-mono tracking-normal normal-case">
                        {' · together'}
                      </span>
                    )}
                  </p>
                  <div
                    className={cn(
                      'flex flex-col gap-1.5 border-l-2 pl-3',
                      together ? 'border-[#1f2d4d]' : 'border-[#d9cfb6]',
                    )}
                  >
                    {group.actionIds.map((id) => {
                      const action = actions.find((a) => a.id === id);
                      if (!action) return null;
                      return (
                        <div
                          key={id}
                          draggable
                          data-drop-step={gi}
                          onDragStart={() => (dragId.current = id)}
                          onDragEnd={() => (dragId.current = null)}
                          onDragOver={allowDrop}
                          onDrop={handleDrop}
                          className="flex items-center gap-2 rounded-lg border border-[#e6dcc4] bg-[#f3ecdb] px-2.5 py-2"
                        >
                          <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-[#b9ac8e] active:cursor-grabbing" />
                          <span className="flex-1 truncate text-sm font-semibold">
                            {actionLabel(action, objects)}
                          </span>
                          <span className="font-mono text-xs text-[#a89372]">
                            {seconds(group.durationMs)}
                          </span>
                          <KebabMenu
                            durationMs={group.durationMs}
                            onDuration={(ms) => setDuration(gi, ms)}
                            onRemove={() => onRemoveAction(id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
            <li>{gap(groups.length)}</li>
          </ol>
        )}

        {groups.length > 0 && (
          <p className="mt-4 rounded-lg border border-dashed border-[#d3c7a8] px-3 py-3 text-xs leading-relaxed text-[#6b6350]">
            Drag an action onto the one above it to run them{' '}
            <strong className="font-semibold text-[#1f2d4d]">together</strong>;
            drop it between steps to run it{' '}
            <strong className="font-semibold text-[#1f2d4d]">after</strong>.
          </p>
        )}
      </div>

      <div className="border-t border-[#e6dcc4] p-4">
        <button
          type="button"
          onClick={onPlay}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1f2d4d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b3c63]"
        >
          <Play className="h-4 w-4" fill="currentColor" />
          Play full animation
        </button>
      </div>
    </section>
  );
}
