'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationGuard } from '@/features/playbook/hooks/editor/use-navigation-guard';
import { useUpdatePlay } from '@/features/playbook/hooks/play/use-update-play';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { isTypingTarget } from '@/features/playbook/utils/editor/keyboard';
import {
  EDITOR_MOBILE_BREAKPOINT,
  EDITOR_STACK_BREAKPOINT,
} from '@/features/playbook/utils/editor/layout';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { usePlayEditorStore } from '@/store/use-play-editor-store';
import { ArrowLeft, Pencil, Redo2, Save, Undo2, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '@/graphql/graphql';
import { useConfirm } from '@/components/feedback/confirm-provider';
import { Button } from '@/components/foundation/button/button';
import { AnimateView } from './animate/animate-view';
import { BreakdownView } from './breakdown/breakdown-view';
import { PhaseRail } from './breakdown/phase-rail';
import { EditorStage } from './editor-stage';
import { BottomTabBar } from './mobile/bottom-tab-bar';
import { PhaseSwitcher } from './mobile/phase-switcher';
import { RosterSheet } from './mobile/roster-sheet';
import { ModeTabs, type EditorMode } from './mode-tabs';
import { RosterPanel } from './roster-panel';
import { StageColumn } from './stage-column';
import { ToolDock } from './tool-dock';

type Props = {
  playId: string;
  routeKey: string;
  name: string;
  category: Category;
  diagram: PlayDiagram;
};

export function PlayEditor({
  playId,
  routeKey,
  name,
  category: initialCategory,
  diagram,
}: Props) {
  const router = useRouter();
  const confirm = useConfirm();
  const { savePlay, isSaving, renamePlay, setPlayCategory } = useUpdatePlay(
    routeKey,
    playId,
  );

  const [mode, setMode] = useState<EditorMode>('draw');
  const isMobile = useIsMobile(EDITOR_MOBILE_BREAKPOINT);
  const isStacked = useIsMobile(EDITOR_STACK_BREAKPOINT);
  const [rosterOpen, setRosterOpen] = useState(false);

  // category is play metadata, written immediately (not with the diagram save);
  // optimistic locally, rolled back on failure.
  const [category, setCategory] = useState(initialCategory);
  const changeCategory = (next: Category) => {
    setCategory(next);
    setPlayCategory(next).catch(() => setCategory(initialCategory));
  };

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
  }, [playId, routeKey, name, diagram]);

  // Reset only when the editor actually unmounts — not on every prop change. A
  // rename or a category change triggers an RSC refresh (new `name` / `diagram`
  // identity); resetting there would wipe the animation the coach is building.
  useEffect(() => usePlayEditorStore.getState().reset, []);

  const court = usePlayEditorStore((s) => s.court);
  const phases = usePlayEditorStore((s) => s.phases);
  const activePhaseIndex = usePlayEditorStore((s) => s.activePhaseIndex);
  const phase = usePlayEditorStore((s) => s.phases[s.activePhaseIndex]);
  const rosterCount = usePlayEditorStore((s) => s.rosterCount);
  const tool = usePlayEditorStore((s) => s.tool);
  const selection = usePlayEditorStore((s) => s.selection);
  const isDirty = usePlayEditorStore((s) => s.isDirty);
  const canUndo = usePlayEditorStore((s) => s.history.length > 0);
  const canRedo = usePlayEditorStore((s) => s.future.length > 0);
  const setTool = usePlayEditorStore((s) => s.setTool);
  const select = usePlayEditorStore((s) => s.select);
  const addPhase = usePlayEditorStore((s) => s.addPhase);
  const addEmptyPhase = usePlayEditorStore((s) => s.addEmptyPhase);
  const deletePhase = usePlayEditorStore((s) => s.deletePhase);
  const duplicatePhase = usePlayEditorStore((s) => s.duplicatePhase);
  const setActivePhase = usePlayEditorStore((s) => s.setActivePhase);
  const reorderPhase = usePlayEditorStore((s) => s.reorderPhase);
  const beginEdit = usePlayEditorStore((s) => s.beginEdit);
  const endEdit = usePlayEditorStore((s) => s.endEdit);
  const moveObject = usePlayEditorStore((s) => s.moveObject);
  const rotateObject = usePlayEditorStore((s) => s.rotateObject);
  const benchObject = usePlayEditorStore((s) => s.benchObject);
  const unbenchObject = usePlayEditorStore((s) => s.unbenchObject);
  const addSlot = usePlayEditorStore((s) => s.addSlot);
  const setBallHolder = usePlayEditorStore((s) => s.setBallHolder);
  const addAction = usePlayEditorStore((s) => s.addAction);
  const updateAction = usePlayEditorStore((s) => s.updateAction);
  const deleteAction = usePlayEditorStore((s) => s.deleteAction);
  const deleteActionAt = usePlayEditorStore((s) => s.deleteActionAt);
  const setPhaseNote = usePlayEditorStore((s) => s.setPhaseNote);
  const setPhaseSteps = usePlayEditorStore((s) => s.setPhaseSteps);
  const undo = usePlayEditorStore((s) => s.undo);
  const redo = usePlayEditorStore((s) => s.redo);
  const markSaved = usePlayEditorStore((s) => s.markSaved);
  const toDiagram = usePlayEditorStore((s) => s.toDiagram);

  const deleteSelection = useCallback(() => {
    if (selection?.kind === 'action') deleteAction(selection.id);
  }, [selection, deleteAction]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        selection?.kind === 'action'
      ) {
        event.preventDefault();
        deleteSelection();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selection, deleteSelection, undo, redo]);

  const draw = useCallback(
    (
      fromId: string,
      end: { toId: string } | { toPoint: { x: number; y: number } },
    ) => {
      if (tool === 'select') return;
      const ok = addAction({ type: tool, fromId, ...end });
      if (!ok) toast.error('Max 30 actions per phase');
    },
    [tool, addAction],
  );

  const editorStage = (
    <EditorStage
      court={court}
      phase={phase}
      ballHolderId={phase.ballHolderId}
      tool={tool}
      selection={selection}
      onSelect={select}
      onPickSelect={() => setTool('select')}
      onDraw={draw}
      onBeginEdit={beginEdit}
      onEndEdit={endEdit}
      onMove={moveObject}
      onBend={(id, bend) => updateAction(id, { bend })}
      onRotate={rotateObject}
      onSetBall={setBallHolder}
      onDelete={deleteSelection}
    />
  );

  const rosterProps = {
    objects: phase.objects,
    rosterCount,
    ballHolderId: phase.ballHolderId,
    selectedId: selection?.kind === 'object' ? selection.id : null,
    onBench: benchObject,
    onUnbench: unbenchObject,
    onAddSlot: addSlot,
    onSetBall: setBallHolder,
    onSelect: (id: string) => select({ kind: 'object', id }),
  };

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

  const [nameDraft, setNameDraft] = useState(name);
  const [renaming, setRenaming] = useState(false);

  const startRenaming = () => {
    setNameDraft(name);
    setRenaming(true);
  };

  const commitName = () => {
    setRenaming(false);
    const next = nameDraft.trim();
    if (next && next !== name) renamePlay(next).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-white">
      <header className="flex items-center gap-2 border-b border-white/10 px-3 py-2 md:gap-3 md:px-4 md:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
          <Button
            variant="close"
            className="text-gray-200 hover:bg-white/10 hover:text-white"
            onClick={leave}
            aria-label="Back to playbook"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="min-w-0 truncate text-lg font-semibold">
            {renaming ? (
              <input
                autoFocus
                aria-label="Play name"
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onBlur={commitName}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') commitName();
                  if (event.key === 'Escape') setRenaming(false);
                }}
                className="w-56 max-w-full rounded bg-slate-800 px-2 py-0.5 outline-none focus:ring-2 focus:ring-orange-400"
              />
            ) : (
              <button
                type="button"
                onClick={startRenaming}
                className="group flex max-w-full items-center gap-2 rounded px-1 hover:bg-white/5"
              >
                <span className="truncate">{name}</span>
                <Pencil className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-gray-200" />
              </button>
            )}
          </h1>
        </div>

        {!isMobile && <ModeTabs mode={mode} onChange={setMode} />}

        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          <Button
            variant="close"
            className="text-gray-200 hover:bg-white/10 hover:text-white disabled:text-gray-600"
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="close"
            className="text-gray-200 hover:bg-white/10 hover:text-white disabled:text-gray-600"
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            onClick={save}
            disabled={!isDirty || isSaving}
            aria-label="Save"
          >
            <Save className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">
              {isSaving ? 'Saving…' : 'Save'}
            </span>
          </Button>
        </div>
      </header>

      <div
        key={mode}
        className="editor-view-enter flex min-h-0 flex-1 flex-col"
      >
        {mode === 'breakdown' ? (
          <BreakdownView
            category={category}
            court={court}
            phases={phases}
            activeIndex={activePhaseIndex}
            onSelectPhase={setActivePhase}
            onAddEmptyPhase={addEmptyPhase}
            onDuplicatePhase={duplicatePhase}
            onCategoryChange={changeCategory}
            onNoteChange={setPhaseNote}
            onEditStart={beginEdit}
            onEditEnd={endEdit}
          />
        ) : mode === 'animate' ? (
          <AnimateView
            court={court}
            phases={phases}
            activeIndex={activePhaseIndex}
            stacked={isStacked}
            compact={isMobile}
            onSelectPhase={setActivePhase}
            onAddPhase={addPhase}
            onAddEmptyPhase={addEmptyPhase}
            onDeletePhase={deletePhase}
            onDuplicatePhase={duplicatePhase}
            onReorderPhase={reorderPhase}
            onStepsChange={setPhaseSteps}
            onEditStart={beginEdit}
            onRemoveAction={deleteActionAt}
          />
        ) : isMobile ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              {editorStage}

              <div className="absolute top-1.5 left-1.5 z-10">
                <PhaseSwitcher
                  phases={phases}
                  court={court}
                  activeIndex={activePhaseIndex}
                  onSelect={setActivePhase}
                  onAddEmpty={addEmptyPhase}
                  onDelete={deletePhase}
                  onDuplicate={duplicatePhase}
                />
              </div>

              <button
                type="button"
                aria-label="Roster"
                onClick={() => setRosterOpen(true)}
                className="absolute top-1.5 right-1.5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#faf6ec] text-[#1f2d4d] shadow-md shadow-black/20"
              >
                <Users className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center rounded-2xl bg-[#faf6ec] py-1.5 shadow-lg shadow-black/25">
              <ToolDock tool={tool} onToolChange={setTool} variant="bar" />
            </div>

            <RosterSheet
              open={rosterOpen}
              onClose={() => setRosterOpen(false)}
              {...rosterProps}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 gap-2 overflow-hidden p-2 xl:gap-3 xl:p-3">
            <PhaseRail
              phases={phases}
              court={court}
              activeIndex={activePhaseIndex}
              onSelect={setActivePhase}
              onAdd={addPhase}
              onAddEmpty={addEmptyPhase}
              onDelete={deletePhase}
              onDuplicate={duplicatePhase}
              onReorder={reorderPhase}
            />

            <StageColumn
              controls={
                <div className="flex items-center rounded-2xl bg-[#faf6ec] px-3 py-1.5 shadow-lg shadow-black/25">
                  <ToolDock tool={tool} onToolChange={setTool} />
                </div>
              }
            >
              {editorStage}
            </StageColumn>

            <RosterPanel {...rosterProps} />
          </div>
        )}
      </div>

      {isMobile && <BottomTabBar mode={mode} onChange={setMode} />}
    </div>
  );
}
