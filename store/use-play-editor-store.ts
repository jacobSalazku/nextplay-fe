import type {
  Action,
  CourtType,
  Phase,
  PlayActionType,
  PlayDiagram,
  Point,
} from '@/features/playbook/diagram/types';
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

// Editor state for one play. A singleton, so `<PlayEditor>` hydrates it for the
// current play and resets on unmount. In-flight save state lives with the
// mutation hook, not here. One phase for now — the phase strip comes later.
export const usePlayEditorStore = create<PlayEditorState>((set, get) => ({
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
    set((state) => ({
      isDirty: true,
      phase: {
        ...state.phase,
        objects: state.phase.objects.map((object) =>
          object.id === id ? { ...object, x, y } : object,
        ),
      },
    })),

  rotateObject: (id, facing) =>
    set((state) => ({
      isDirty: true,
      phase: {
        ...state.phase,
        objects: state.phase.objects.map((object) =>
          object.id === id ? { ...object, facing } : object,
        ),
      },
    })),

  addAction: (input) => {
    const { phase } = get();
    if (phase.actions.length >= MAX_ACTIONS) return false;

    const action: Action = { ...input, id: newActionId() };
    set({
      isDirty: true,
      phase: { ...phase, actions: [...phase.actions, action] },
      selection: { kind: 'action', id: action.id },
    });
    return true;
  },

  updateAction: (id, patch) =>
    set((state) => ({
      isDirty: true,
      phase: {
        ...state.phase,
        actions: state.phase.actions.map((action) => {
          if (action.id !== id) return action;
          const next = { ...action, ...patch };
          if (next.bend == null) delete next.bend;
          return next;
        }),
      },
    })),

  deleteAction: (id) =>
    set((state) => ({
      isDirty: true,
      phase: {
        ...state.phase,
        actions: state.phase.actions.filter((action) => action.id !== id),
      },
      selection:
        state.selection?.kind === 'action' && state.selection.id === id
          ? null
          : state.selection,
    })),

  // Success only — a failed save must leave isDirty set so the coach can retry.
  markSaved: () => set({ isDirty: false }),

  toDiagram: () => {
    const { court, phase } = get();
    return { version: 1, court, phases: [phase], timeline: [] };
  },
}));
