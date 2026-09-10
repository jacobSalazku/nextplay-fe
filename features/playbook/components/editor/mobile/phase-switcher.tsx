'use client';

import { useRef, useState } from 'react';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import { useDismiss } from '@/features/playbook/hooks/editor/use-dismiss';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { MAX_PHASES } from '@/features/playbook/utils/editor/phase-rail';
import { cn } from '@/utils/tw-merge';
import { ChevronDown, Copy, Plus, Trash2 } from 'lucide-react';
import { AddPhaseMenu } from './add-phase-menu';

type Props = {
  phases: Phase[];
  court: CourtType;
  activeIndex: number;
  onSelect: (index: number) => void;
  onAddEmpty: () => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
};

export function PhaseSwitcher({
  phases,
  court,
  activeIndex,
  onSelect,
  onAddEmpty,
  onDelete,
  onDuplicate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#faf6ec] px-3 py-1.5 text-sm font-semibold text-[#1f2d4d] shadow-md shadow-black/20"
      >
        Phase {activeIndex + 1} / {phases.length}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-20 mt-1 max-h-[60vh] w-56 overflow-y-auto rounded-xl border border-[#d8cbac] bg-[#faf6ec] p-1.5 text-[#1f2d4d] shadow-xl shadow-black/30"
        >
          {phases.map((phase, index) => {
            const active = index === activeIndex;
            return (
              <div
                key={phase.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-1.5 py-1',
                  active && 'bg-[#1f2d4d]/10',
                )}
              >
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    onSelect(index);
                    setOpen(false);
                  }}
                  className="flex flex-1 cursor-pointer items-center gap-2 text-left text-sm font-medium"
                >
                  <span
                    className={cn(
                      'w-12 shrink-0 overflow-hidden rounded border',
                      active ? 'border-[#1f2d4d]' : 'border-[#cdb894]',
                    )}
                  >
                    <CourtDiagram
                      court={court}
                      phase={phase}
                      className="block w-full"
                    />
                  </span>
                  Phase {index + 1}
                </button>

                {phases.length < MAX_PHASES && (
                  <button
                    type="button"
                    aria-label={`Duplicate phase ${index + 1}`}
                    onClick={() => {
                      onDuplicate(index);
                      setOpen(false);
                    }}
                    className="cursor-pointer rounded p-1 text-[#8a7a5c] hover:bg-black/5 hover:text-[#1f2d4d]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
                {phases.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Delete phase ${index + 1}`}
                    onClick={() => {
                      onDelete(index);
                      setOpen(false);
                    }}
                    className="cursor-pointer rounded p-1 text-red-700 hover:bg-red-700/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {phases.length < MAX_PHASES && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setAddOpen(true);
              }}
              className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg border-t border-[#e6dcc4] px-2 py-2 text-sm font-medium text-[#1f2d4d] hover:bg-black/5"
            >
              <Plus className="h-4 w-4" />
              Add phase
            </button>
          )}
        </div>
      )}

      <AddPhaseMenu
        open={addOpen}
        variant="sheet"
        activeIndex={activeIndex}
        onClone={() => onDuplicate(activeIndex)}
        onEmpty={onAddEmpty}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
