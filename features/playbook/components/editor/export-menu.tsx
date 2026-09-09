'use client';

import { useEffect, useRef, useState } from 'react';
import {
  exportPhasePng,
  exportSheetPng,
} from '@/features/playbook/utils/diagram/export-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  court: CourtType;
  phases: Phase[];
  activeIndex: number;
  playName: string;
};

export function ExportMenu({ court, phases, activeIndex, playName }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const run = async (task: () => Promise<void>) => {
    setOpen(false);
    setBusy(true);
    try {
      await task();
    } catch {
      toast.error('Could not export the diagram');
    } finally {
      setBusy(false);
    }
  };

  const item =
    'flex w-full cursor-pointer items-center justify-between gap-6 px-3 py-2 text-left text-sm hover:bg-white/10 disabled:opacity-50';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Export"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 rounded p-2 text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Export</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-60 overflow-hidden rounded-lg border border-white/10 bg-slate-800 py-1 text-white shadow-xl">
          <button
            type="button"
            className={item}
            onClick={() => run(() => exportSheetPng(court, phases, playName))}
          >
            All phases
            <span className="text-xs text-gray-400">
              {phases.length} on one sheet
            </span>
          </button>
          <button
            type="button"
            className={item}
            onClick={() =>
              run(() =>
                exportPhasePng(
                  court,
                  phases[activeIndex],
                  playName,
                  activeIndex + 1,
                ),
              )
            }
          >
            Current phase
            <span className="text-xs text-gray-400">
              phase {activeIndex + 1}
            </span>
          </button>
          <p
            className={cn(
              'px-3 pt-1.5 pb-1 text-[11px] leading-snug text-gray-500',
            )}
          >
            Saved as PNG to your downloads.
          </p>
        </div>
      )}
    </div>
  );
}
