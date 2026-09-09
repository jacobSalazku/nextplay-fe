'use client';

import { useEffect, useRef, useState } from 'react';
import {
  exportPhasePng,
  exportSheetPng,
} from '@/features/playbook/utils/diagram/export-diagram';
import { openPlaySheet } from '@/features/playbook/utils/diagram/play-sheet';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { FileText, ImageIcon, LayoutGrid, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type Props = {
  court: CourtType;
  phases: Phase[];
  activeIndex: number;
  playName: string;
  category: string;
};

export function ExportMenu({
  court,
  phases,
  activeIndex,
  playName,
  category,
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const coachName = session?.user?.name ?? 'Coach';

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const run = async (task: () => void | Promise<void>) => {
    setOpen(false);
    setBusy(true);
    try {
      await task();
    } catch {
      toast.error('Could not export the play');
    } finally {
      setBusy(false);
    }
  };

  const item =
    'flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left hover:bg-white/10';

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
          <ImageIcon className="h-4 w-4" aria-hidden />
        )}
        <span className="hidden sm:inline">Export</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-72 overflow-hidden rounded-lg border border-white/10 bg-slate-800 py-1 text-white shadow-xl">
          <button
            type="button"
            className={item}
            onClick={() =>
              run(() =>
                openPlaySheet({
                  playName,
                  coachName,
                  category,
                  court,
                  phases,
                }),
              )
            }
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
            <span>
              Coaching sheet
              <span className="block text-xs text-gray-400">
                every phase with its notes — print or save as PDF
              </span>
            </span>
          </button>

          <button
            type="button"
            className={item}
            onClick={() => run(() => exportSheetPng(court, phases, playName))}
          >
            <LayoutGrid className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
            <span>
              All phases (PNG)
              <span className="block text-xs text-gray-400">
                {phases.length} courts on one image
              </span>
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
            <ImageIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-300"
              aria-hidden
            />
            <span>
              Current phase (PNG)
              <span className="block text-xs text-gray-400">
                phase {activeIndex + 1} only
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
