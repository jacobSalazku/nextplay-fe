'use client';

import { useEffect } from 'react';
import { isTypingTarget } from '@/features/playbook/utils/editor/keyboard';
import type { EditorTool } from '@/store/use-play-editor-store';
import { cn } from '@/utils/tw-merge';
import {
  ArrowLeftRight,
  ArrowUpRight,
  MousePointer2,
  MoveRight,
  Spline,
  Split,
  Target,
  type LucideIcon,
} from 'lucide-react';

type ToolDef = {
  tool: EditorTool;
  label: string;
  icon: LucideIcon;
  shortcut: string;
};

const TOOLS: ToolDef[] = [
  { tool: 'select', label: 'Select', icon: MousePointer2, shortcut: 'V' },
  { tool: 'pass', label: 'Pass', icon: MoveRight, shortcut: '1' },
  { tool: 'dribble', label: 'Dribble', icon: Spline, shortcut: '2' },
  { tool: 'cut', label: 'Cut', icon: ArrowUpRight, shortcut: '3' },
  { tool: 'screen', label: 'Screen', icon: Split, shortcut: '4' },
  { tool: 'shot', label: 'Shot', icon: Target, shortcut: '5' },
  { tool: 'handoff', label: 'Handoff', icon: ArrowLeftRight, shortcut: '6' },
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
  className,
}: {
  tool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  className?: string;
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
      className={cn(
        'flex max-w-[calc(100vw-2rem)] gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/90 p-1.5 shadow-xl shadow-black/40 backdrop-blur',
        className,
      )}
    >
      {TOOLS.map(({ tool: value, label, icon: Icon, shortcut }, index) => (
        <div key={value} className="flex items-center">
          {index === 1 && <div className="mx-1 h-8 w-px bg-white/10" />}
          <button
            type="button"
            aria-pressed={tool === value}
            aria-keyshortcuts={shortcut}
            title={`${label} (${shortcut})`}
            onClick={() => onToolChange(value)}
            className={cn(
              'flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs transition',
              tool === value
                ? 'bg-orange-500/20 text-orange-200'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        </div>
      ))}
    </div>
  );
}
