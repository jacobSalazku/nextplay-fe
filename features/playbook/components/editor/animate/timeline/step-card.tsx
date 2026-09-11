'use client';

import type {
  Action,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import { GripVertical } from 'lucide-react';
import { actionLabel } from './labels';
import { StepMenu } from './step-menu';

type Props = {
  action: Action;
  objects: PlacedObject[];
  stepIndex: number;
  canMergeUp: boolean;
  grouped: boolean;
  stacked?: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent<HTMLElement>) => void;
  onMergeUp: () => void;
  onSplitOut: () => void;
  onRemove: () => void;
};

export function StepCard({
  action,
  objects,
  stepIndex,
  canMergeUp,
  grouped,
  stacked = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onMergeUp,
  onSplitOut,
  onRemove,
}: Props) {
  const dnd = stacked
    ? {}
    : {
        draggable: true,
        'data-drop-step': stepIndex,
        onDragStart,
        onDragEnd,
        onDragOver,
        onDrop,
      };

  return (
    <div
      {...dnd}
      className="flex items-center gap-2 rounded-lg border border-[#e6dcc4] bg-[#f3ecdb] px-2.5 py-1.5"
    >
      {!stacked && (
        <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-[#b9ac8e] active:cursor-grabbing" />
      )}
      <span className="flex-1 truncate text-sm font-semibold">
        {actionLabel(action, objects)}
      </span>
      <StepMenu
        onRemove={onRemove}
        onMergeUp={canMergeUp ? onMergeUp : undefined}
        onSplitOut={grouped ? onSplitOut : undefined}
      />
    </div>
  );
}
