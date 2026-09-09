'use client';

import { useRef } from 'react';
import type {
  Action,
  PlacedObject,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';
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
  actions: Action[];
  objects: PlacedObject[];
  steps?: Step[];
  onChange: (steps: Step[]) => void;
  onRemoveAction: (id: string) => void;
  className?: string;
};

export function ActionTimeline({
  actions,
  objects,
  steps,
  onChange,
  onRemoveAction,
  className,
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
      className={cn(
        'flex max-h-full w-80 shrink-0 flex-col self-start overflow-hidden rounded-2xl bg-[#faf6ec] text-[#1f2d4d]',
        className,
      )}
    >
      <h2 className="border-b border-[#e6dcc4] px-5 py-3.5 text-xs font-semibold tracking-wider text-[#8a7a5c] uppercase">
        Action timeline
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {groups.length === 0 ? (
          <p className="text-sm text-[#6b6350]">
            No moves in this phase yet. Switch to{' '}
            <strong className="font-semibold text-[#1f2d4d]">Draw</strong> to
            add passes, cuts and screens — they show up here to sequence.
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
    </section>
  );
}
