'use client';

import { useDismiss } from '@/features/playbook/hooks/editor/use-dismiss';
import { cn } from '@/utils/tw-merge';
import { Copy, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  activeIndex: number;
  onClone: () => void;
  onEmpty: () => void;
  onClose: () => void;
  variant: 'sheet' | 'dialog';
};

export function AddPhaseMenu({
  open,
  activeIndex,
  onClone,
  onEmpty,
  onClose,
  variant,
}: Props) {
  useDismiss(open, onClose);

  if (!open || typeof document === 'undefined') return null;

  const sheet = variant === 'sheet';
  const item =
    'flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left text-sm font-semibold text-[#1f2d4d] hover:bg-black/5';

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        sheet ? 'flex-col justify-end' : 'items-center justify-center p-4',
      )}
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />

      <div
        role="dialog"
        aria-label="Add phase"
        className={cn(
          'relative overflow-hidden bg-[#faf6ec] text-[#1f2d4d] shadow-2xl shadow-black/50',
          sheet
            ? 'editor-sheet-in w-full rounded-t-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]'
            : 'w-[calc(100vw-2rem)] max-w-xs rounded-2xl',
        )}
      >
        <p className="px-5 pt-4 pb-2 text-xs font-semibold tracking-wider text-[#8a7a5c] uppercase">
          Add phase
        </p>

        <button
          type="button"
          className={item}
          onClick={() => {
            onClone();
            onClose();
          }}
        >
          <Copy className="h-4 w-4 shrink-0" />
          Clone phase {activeIndex + 1}
        </button>

        <button
          type="button"
          className={cn(item, 'border-t border-[#e6dcc4]')}
          onClick={() => {
            onEmpty();
            onClose();
          }}
        >
          <Plus className="h-4 w-4 shrink-0" />
          Empty court
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full cursor-pointer border-t border-[#e6dcc4] px-5 py-3.5 text-sm font-semibold text-[#8a7a5c] hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}
