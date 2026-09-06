import type {
  Action,
  CourtType,
  Phase,
  PlayActionType,
  PlayDiagram,
  Point,
} from '@/features/playbook/utils/diagram/types';
import { create } from 'zustand';

export type EditorTool = 'select' | PlayActionType;
export type Selection = { kind: 'object' | 'action'; id: string } | null;

const MAX_ACTIONS = 30;

const newActionId = () => `a${Math.random().toString(36).slice(2, 9)}`;

type HydrateInput = {
  playId: string;
  routeKey: string;
  name: string;
  diagram: PlayDiagram;
};

type PlayEditorState = {
  hydrated: boolean;
  playId: string;
  routeKey: string;
  name: string;
  court: CourtType;
  phase: Phase;
  tool: EditorTool;
  selection: Selection;
  isDirty: boolean;

  hydrate: (input: HydrateInput) => void;
  reset: () => void;
  setTool: (tool: EditorTool) => void;
  select: (selection: Selection) => void;
  moveObject: (id: string, x: number, y: number) => void;
  rotateObject: (id: string, facing: number) => void;
  addAction: (action: Omit<Action, 'id'>) => boolean;
  updateAction: (id: string, patch: { bend?: Point }) => void;
  deleteAction: (id: string) => void;
  markSaved: () => void;
  toDiagram: () => PlayDiagram;
};

const EMPTY_PHASE: Phase = { id: '', objects: [], actions: [] };

const initialState = {
  hydrated: false,
  playId: '',
  routeKey: '',
  name: '',
  court: 'half' as CourtType,
  phase: EMPTY_PHASE,
  tool: 'select' as EditorTool,
  selection: null as Selection,
  isDirty: false,
};

const patchById = <T extends { id: string }>(
  list: T[],
  id: string,
  patch: (item: T) => T,
): T[] => list.map((item) => (item.id === id ? patch(item) : item));

// Editor state for one play. A singleton, so `<PlayEditor>` hydrates it for the
// current play and resets on unmount. In-flight save state lives with the
// mutation hook, not here. One phase for now — the phase strip comes later.
export const usePlayEditorStore = create<PlayEditorState>((set, get) => {
  // Every phase edit clones the phase and marks the play dirty.
  const editPhase = (fn: (phase: Phase) => Phase) =>
    set((state) => ({ isDirty: true, phase: fn(state.phase) }));

  return {
    ...initialState,

    hydrate: ({ playId, routeKey, name, diagram }) =>
      set({
        ...initialState,
        hydrated: true,
        playId,
        routeKey,
        name,
        court: diagram.court,
        phase: diagram.phases[0],
      }),

    reset: () => set(initialState),

    setTool: (tool) => set({ tool, selection: null }),

    select: (selection) => set({ selection }),

    moveObject: (id, x, y) =>
      editPhase((phase) => ({
        ...phase,
        objects: patchById(phase.objects, id, (o) => ({ ...o, x, y })),
      })),

    rotateObject: (id, facing) =>
      editPhase((phase) => ({
        ...phase,
        objects: patchById(phase.objects, id, (o) => ({ ...o, facing })),
      })),

    addAction: (input) => {
      if (get().phase.actions.length >= MAX_ACTIONS) return false;

      const action: Action = { ...input, id: newActionId() };
      editPhase((phase) => ({
        ...phase,
        actions: [...phase.actions, action],
      }));
      set({ selection: { kind: 'action', id: action.id } });
      return true;
    },

    updateAction: (id, patch) =>
      editPhase((phase) => ({
        ...phase,
        actions: patchById(phase.actions, id, (action) => {
          const next = { ...action, ...patch };
          if (next.bend == null) delete next.bend;
          return next;
        }),
      })),

    deleteAction: (id) => {
      editPhase((phase) => ({
        ...phase,
        actions: phase.actions.filter((action) => action.id !== id),
      }));
      set((state) =>
        state.selection?.kind === 'action' && state.selection.id === id
          ? { selection: null }
          : {},
      );
    },

    // Success only — a failed save must leave isDirty set so the coach can retry.
    markSaved: () => set({ isDirty: false }),

    toDiagram: () => {
      const { court, phase } = get();
      return { version: 1, court, phases: [phase], timeline: [] };
    },
  };
});
