'use client';

import { useEffect } from 'react';
import { isTypingTarget } from '@/features/playbook/utils/editor/keyboard';
import type { EditorTool } from '@/store/use-play-editor-store';
import { cn } from '@/utils/tw-merge';
import {
  ArrowRight,
  ArrowUpRight,
  CircleDashed,
  MousePointer2,
  Plus,
  Redo2,
  Spline,
  type LucideIcon,
} from 'lucide-react';

type ToolDef = {
  tool: EditorTool;
  label: string;
  icon: LucideIcon;
  shortcut: string;
};

const DRAW_TOOLS: ToolDef[] = [
  { tool: 'dribble', label: 'Dribble', icon: Spline, shortcut: '2' },
  { tool: 'pass', label: 'Pass', icon: ArrowRight, shortcut: '1' },
  { tool: 'cut', label: 'Cut', icon: ArrowUpRight, shortcut: '3' },
  { tool: 'screen', label: 'Screen', icon: Plus, shortcut: '4' },
  { tool: 'shot', label: 'Shot', icon: CircleDashed, shortcut: '5' },
  { tool: 'handoff', label: 'Handoff', icon: Redo2, shortcut: '6' },
];

const SHORTCUTS = new Map<string, EditorTool>([
  ['v', 'select'],
  ['escape', 'select'],
  ['1', 'pass'],
  ['2', 'dribble'],
  ['3', 'cut'],
  ['4', 'screen'],
  ['5', 'shot'],
  ['6', 'handoff'],
]);

export function ToolDock({
  tool,
  onToolChange,
}: {
  tool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const next = SHORTCUTS.get(event.key.toLowerCase());
      if (next) {
        event.preventDefault();
        onToolChange(next);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onToolChange]);

  return (
    <div
      role="toolbar"
      aria-label="Drawing tools"
      className="flex items-center"
    >
      <button
        type="button"
        aria-pressed={tool === 'select'}
        aria-keyshortcuts="V"
        title="Select (V)"
        onClick={() => onToolChange('select')}
        className={cn(
          'flex shrink-0 cursor-pointer flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-semibold transition',
          tool === 'select'
            ? 'bg-[#1f2d4d] text-white'
            : 'text-[#1f2d4d] hover:bg-black/5',
        )}
      >
        <MousePointer2 className="h-4 w-4" fill="currentColor" />
        Select
      </button>

      <div className="mx-2 h-9 w-px bg-[#e0d5bb]" />

      <div className="flex items-center gap-0.5">
        {DRAW_TOOLS.map(({ tool: value, label, icon: Icon, shortcut }) => (
          <button
            key={value}
            type="button"
            aria-pressed={tool === value}
            aria-keyshortcuts={shortcut}
            title={`${label} (${shortcut})`}
            onClick={() => onToolChange(value)}
            className={cn(
              'flex shrink-0 cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition',
              tool === value
                ? 'bg-[#1f2d4d]/10 font-semibold text-[#1f2d4d]'
                : 'text-[#a89372] hover:bg-black/5',
            )}
          >
            <Icon className="h-4 w-4 text-[#1f2d4d]" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
