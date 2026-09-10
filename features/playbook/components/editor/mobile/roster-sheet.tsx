'use client';

import {
  RosterSections,
  type RosterSectionsProps,
} from '../roster/roster-sections';
import { useDismiss } from '@/features/playbook/hooks/editor/use-dismiss';
import { createPortal } from 'react-dom';

type Props = RosterSectionsProps & {
  open: boolean;
  onClose: () => void;
};

export function RosterSheet({ open, onClose, ...sections }: Props) {
  useDismiss(open, onClose);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close roster"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />

      <div
        role="dialog"
        aria-label="Roster"
        className="editor-sheet-in relative max-h-[80vh] space-y-6 overflow-y-auto rounded-t-2xl border-t border-white/10 bg-slate-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-white shadow-2xl shadow-black/50"
      >
        <div
          aria-hidden
          className="mx-auto h-1 w-10 rounded-full bg-white/20"
        />
        <RosterSections {...sections} />
      </div>
    </div>,
    document.body,
  );
}
