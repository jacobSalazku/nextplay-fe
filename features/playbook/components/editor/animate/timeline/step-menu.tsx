'use client';

import { useRef, useState } from 'react';
import { useDismiss } from '@/features/playbook/hooks/editor/use-dismiss';
import { cn } from '@/utils/tw-merge';
import { MoreVertical } from 'lucide-react';

type Props = {
  onRemove: () => void;
  onMergeUp?: () => void;
  onSplitOut?: () => void;
};

export function StepMenu({ onRemove, onMergeUp, onSplitOut }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);

  const item =
    'w-full cursor-pointer px-3 py-1.5 text-left text-sm hover:bg-black/5';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Step options"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded p-1 text-[#b9ac8e] transition hover:bg-black/5 hover:text-[#1f2d4d]"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-[#e6dcc4] bg-[#faf6ec] py-1 text-[#1f2d4d] shadow-lg">
          {onMergeUp && (
            <button
              type="button"
              onClick={() => {
                onMergeUp();
                setOpen(false);
              }}
              className={item}
            >
              Run with step above
            </button>
          )}
          {onSplitOut && (
            <button
              type="button"
              onClick={() => {
                onSplitOut();
                setOpen(false);
              }}
              className={item}
            >
              Run on its own
            </button>
          )}

          {(onMergeUp || onSplitOut) && (
            <div className="my-1 border-t border-[#e6dcc4]" />
          )}
          <button
            type="button"
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className={cn(item, 'text-red-700')}
          >
            Remove action
          </button>
        </div>
      )}
    </div>
  );
}
