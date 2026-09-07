'use client';

import type {
  Action,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import { GripVertical } from 'lucide-react';
import { actionLabel, durationLabel } from './labels';
import { TimingMenu } from './timing-menu';

type Props = {
  action: Action;
  objects: PlacedObject[];
  stepIndex: number;
  durationMs: number;
  canMergeUp: boolean;
  grouped: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent<HTMLElement>) => void;
  onRetime: (ms: number) => void;
  onMergeUp: () => void;
  onSplitOut: () => void;
  onRemove: () => void;
};

export function StepCard({
  action,
  objects,
  stepIndex,
  durationMs,
  canMergeUp,
  grouped,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onRetime,
  onMergeUp,
  onSplitOut,
  onRemove,
}: Props) {
  return (
    <div
      draggable
      data-drop-step={stepIndex}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex items-center gap-2 rounded-lg border border-[#e6dcc4] bg-[#f3ecdb] px-2.5 py-2"
    >
      <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-[#b9ac8e] active:cursor-grabbing" />
      <span className="flex-1 truncate text-sm font-semibold">
        {actionLabel(action, objects)}
      </span>
      <span className="font-mono text-xs text-[#a89372]">
        {durationLabel(durationMs)}
      </span>
      <TimingMenu
        durationMs={durationMs}
        onDuration={onRetime}
        onRemove={onRemove}
        onMergeUp={canMergeUp ? onMergeUp : undefined}
        onSplitOut={grouped ? onSplitOut : undefined}
      />
    </div>
  );
}
