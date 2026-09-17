'use client';

import { useRef, useState } from 'react';
import { useDismiss } from '@/features/playbook/hooks/editor/use-dismiss';
import { cn } from '@/utils/tw-merge';
import { Copy, MoreVertical, Trash2 } from 'lucide-react';

export function PhaseMenu({
  onDuplicate,
  onDelete,
}: {
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);

  if (!onDuplicate && !onDelete) return null;

  const item =
    'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-black/5';

  return (
    <div ref={ref} className="absolute top-1 right-1 z-10">
      <button
        type="button"
        aria-label="Phase options"
        aria-expanded={open}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((o) => !o)}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md bg-[#1f2d4d]/85 text-white transition hover:bg-[#1f2d4d]"
      >
        <MoreVertical className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 overflow-hidden rounded-lg border border-[#d8cbac] bg-[#faf6ec] py-1 text-[#1f2d4d] shadow-lg">
          {onDuplicate && (
            <button
              type="button"
              className={item}
              onClick={() => {
                onDuplicate();
                setOpen(false);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={cn(item, 'text-red-700')}
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
