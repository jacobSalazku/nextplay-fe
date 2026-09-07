'use client';

import { useRef } from 'react';
import type {
  Action,
  PlacedObject,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';
import { Play } from 'lucide-react';
import { StepCard } from './step-card';
import {
  groupsFromSteps,
  moveToStep,
  retimeStep,
  splitToStep,
  stepsFromGroups,
  type Group,
} from './steps';

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

  const commit = (next: Group[]) => onChange(stepsFromGroups(next, actions));

  const allowDrop = (event: React.DragEvent) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const id = dragId.current;
    dragId.current = null;
    if (!id) return;
    const { dropStep, dropGap } = event.currentTarget.dataset;
    if (dropStep != null) commit(moveToStep(groups, id, Number(dropStep)));
    else if (dropGap != null) commit(splitToStep(groups, id, Number(dropGap)));
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
                        <StepCard
                          key={id}
                          action={action}
                          objects={objects}
                          stepIndex={gi}
                          durationMs={group.durationMs}
                          canMergeUp={gi > 0}
                          grouped={together}
                          onDragStart={() => (dragId.current = id)}
                          onDragEnd={() => (dragId.current = null)}
                          onDragOver={allowDrop}
                          onDrop={handleDrop}
                          onRetime={(ms) => commit(retimeStep(groups, gi, ms))}
                          onMergeUp={() =>
                            commit(moveToStep(groups, id, gi - 1))
                          }
                          onSplitOut={() =>
                            commit(splitToStep(groups, id, gi + 1))
                          }
                          onRemove={() => onRemoveAction(id)}
                        />
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
