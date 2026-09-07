'use client';

import { cn } from '@/utils/tw-merge';
import { MessageSquare, Pencil, Play } from 'lucide-react';

export type EditorMode = 'draw' | 'breakdown';

const TABS = [
  { value: 'draw', label: 'Draw', icon: Pencil },
  { value: 'animate', label: 'Animate', icon: Play, disabled: true },
  { value: 'breakdown', label: 'Breakdown', icon: MessageSquare },
] as const;

type ModeTabsProps = {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
};

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Editor mode"
      className="flex rounded-lg border border-white/10 bg-slate-900 p-0.5"
    >
      {TABS.map(({ value, label, icon: Icon, ...rest }) => {
        const disabled = 'disabled' in rest && rest.disabled;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            disabled={disabled}
            onClick={() => !disabled && onChange(value as EditorMode)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1 text-sm transition',
              mode === value
                ? 'bg-slate-700 text-white'
                : 'text-gray-400 hover:text-white',
              disabled
                ? 'cursor-not-allowed opacity-40 hover:text-gray-400'
                : 'cursor-pointer',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
