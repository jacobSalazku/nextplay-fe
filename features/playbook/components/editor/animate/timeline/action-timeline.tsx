'use client';

import { useRef } from 'react';
import type {
  Action,
  PlacedObject,
  Step,
} from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StepCard } from './step-card';
import {
  groupsFromSteps,
  moveToStep,
  reorderGroup,
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
  // 'stacked' = ▲/▼ reorder instead of drag, flowing in the page
  variant?: 'panel' | 'stacked';
};

export function ActionTimeline({
  actions,
  objects,
  steps,
  onChange,
  onRemoveAction,
  className,
  variant = 'panel',
}: Props) {
  const stacked = variant === 'stacked';
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

  const gap = (at: number) =>
    stacked ? null : (
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
        'rounded-2xl bg-[#faf6ec] text-[#1f2d4d]',
        stacked
          ? 'flex w-full flex-col'
          : 'flex max-h-full w-[clamp(11rem,19vw,20rem)] shrink-0 flex-col self-start overflow-hidden',
        className,
      )}
    >
      <h2 className="border-b border-[#e6dcc4] px-5 py-3.5 text-xs font-semibold tracking-wider text-[#8a7a5c] uppercase">
        Action timeline
      </h2>

      <div
        className={cn(
          'px-5 py-4',
          !stacked && 'min-h-0 flex-1 overflow-y-auto',
        )}
      >
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
              const cards = (
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
                        canMergeUp={gi > 0}
                        grouped={together}
                        stacked={stacked}
                        onDragStart={() => (dragId.current = id)}
                        onDragEnd={() => (dragId.current = null)}
                        onDragOver={allowDrop}
                        onDrop={handleDrop}
                        onMergeUp={() => commit(moveToStep(groups, id, gi - 1))}
                        onSplitOut={() =>
                          commit(splitToStep(groups, id, gi + 1))
                        }
                        onRemove={() => onRemoveAction(id)}
                      />
                    );
                  })}
                </div>
              );

              const header = (
                <p className="mb-1.5 pl-3 text-xs font-semibold tracking-wider text-[#a89372] uppercase">
                  Step {gi + 1}
                  {together && (
                    <span className="font-mono tracking-normal normal-case">
                      {' · together'}
                    </span>
                  )}
                </p>
              );

              return (
                <li key={gi}>
                  {gap(gi)}
                  {stacked ? (
                    <div className="mb-2 flex gap-1.5">
                      <div className="flex flex-col gap-1 pt-5">
                        <button
                          type="button"
                          aria-label={`Move step ${gi + 1} earlier`}
                          disabled={gi === 0}
                          onClick={() =>
                            commit(reorderGroup(groups, gi, gi - 1))
                          }
                          className="cursor-pointer rounded border border-[#e6dcc4] p-1 text-[#8a7a5c] disabled:opacity-30"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move step ${gi + 1} later`}
                          disabled={gi === groups.length - 1}
                          onClick={() =>
                            commit(reorderGroup(groups, gi, gi + 1))
                          }
                          className="cursor-pointer rounded border border-[#e6dcc4] p-1 text-[#8a7a5c] disabled:opacity-30"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        {header}
                        {cards}
                      </div>
                    </div>
                  ) : (
                    <>
                      {header}
                      {cards}
                    </>
                  )}
                </li>
              );
            })}
            <li>{gap(groups.length)}</li>
          </ol>
        )}

        {groups.length > 0 && !stacked && (
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
