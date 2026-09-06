'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUpdatePlay } from '../hooks/use-update-play';
import type { PlayDiagram } from '@/features/playbook/diagram/types';
import { usePlayEditorStore } from '@/store/use-play-editor-store';
import { ArrowLeft, Save } from 'lucide-react';
import { useConfirm } from '@/components/feedback/confirm-provider';
import { Button } from '@/components/foundation/button/button';
import { EditorStage } from './editor-stage';
import { useNavigationGuard } from './use-navigation-guard';

type Props = {
  playId: string;
  routeKey: string;
  name: string;
  diagram: PlayDiagram;
};

export function PlayEditor({ playId, routeKey, name, diagram }: Props) {
  const router = useRouter();
  const confirm = useConfirm();
  const { savePlay, isSaving } = useUpdatePlay(routeKey, playId);

  // Load this play into the singleton store. The initializer hydrates before
  // the first paint (no empty flash); the effect re-hydrates only if the store
  // isn't already on this play (covers a StrictMode remount) — it must never
  // clobber unsaved edits when the RSC re-renders after a refresh. The page
  // keys <PlayEditor> by play id, so switching plays remounts and re-runs both.
  useState(() => {
    usePlayEditorStore.getState().hydrate({ playId, routeKey, name, diagram });
  });
  useEffect(() => {
    const store = usePlayEditorStore.getState();
    if (!store.hydrated || store.playId !== playId) {
      store.hydrate({ playId, routeKey, name, diagram });
    }
    return store.reset;
  }, [playId, routeKey, name, diagram]);

  const court = usePlayEditorStore((s) => s.court);
  const phase = usePlayEditorStore((s) => s.phase);
  const selection = usePlayEditorStore((s) => s.selection);
  const isDirty = usePlayEditorStore((s) => s.isDirty);
  const select = usePlayEditorStore((s) => s.select);
  const moveObject = usePlayEditorStore((s) => s.moveObject);
  const markSaved = usePlayEditorStore((s) => s.markSaved);
  const toDiagram = usePlayEditorStore((s) => s.toDiagram);

  const toPlaybook = `/team/${routeKey}/playbook`;

  const confirmDiscard = useCallback(
    () =>
      confirm({
        title: 'Leave without saving?',
        description: 'Your changes to this play will be lost.',
        confirmLabel: 'Leave',
        confirmVariant: 'danger',
      }),
    [confirm],
  );

  useNavigationGuard({
    enabled: isDirty,
    confirm: confirmDiscard,
    onLeave: () => router.push(toPlaybook),
  });

  const save = async () => {
    try {
      await savePlay(toDiagram());
      markSaved();
    } catch {
      // save failed (toasted globally) — keep isDirty so the coach can retry
    }
  };

  const leave = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    router.push(toPlaybook);
  };

  const selectedObject =
    selection?.kind === 'object'
      ? (phase.objects.find((o) => o.id === selection.id) ?? null)
      : null;

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="close" onClick={leave} aria-label="Back to playbook">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="truncate text-lg font-semibold">{name}</h1>
        </div>
        <Button
          variant="primary"
          onClick={save}
          disabled={!isDirty || isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row">
        <div className="flex flex-1 items-start justify-center">
          <div className="w-full max-w-2xl">
            <EditorStage
              court={court}
              phase={phase}
              ballHolderId={phase.ballHolderId}
              selection={selection}
              onSelect={select}
              onMove={moveObject}
            />
          </div>
        </div>

        <aside className="w-full shrink-0 space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 lg:w-72">
          <div>
            <p className="text-xs tracking-wide text-gray-400 uppercase">
              Court
            </p>
            <p className="text-sm capitalize">{court} court</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-gray-400 uppercase">
              Selected
            </p>
            <p className="text-sm">
              {selectedObject
                ? `Player ${selectedObject.label}`
                : 'Nothing selected'}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Drag a player to reposition. Actions and phases come next.
          </p>
        </aside>
      </div>
    </div>
  );
}
