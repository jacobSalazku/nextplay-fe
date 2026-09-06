import type {
  CourtType,
  Phase,
  PlayDiagram,
} from '@/features/playbook/diagram/types';
import { create } from 'zustand';

type SaveStatus = 'idle' | 'saving';

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
  selectedId: string | null;
  isDirty: boolean;
  status: SaveStatus;

  hydrate: (input: HydrateInput) => void;
  reset: () => void;
  select: (id: string | null) => void;
  moveObject: (id: string, x: number, y: number) => void;
  markSaving: () => void;
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
  selectedId: null as string | null,
  isDirty: false,
  status: 'idle' as SaveStatus,
};

// Editor state for one play. A singleton, so `<PlayEditor>` calls hydrate on
// mount and reset on unmount. One phase for now — the phase strip comes later.
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

  select: (selectedId) => set({ selectedId }),

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

  markSaving: () => set({ status: 'saving' }),

  markSaved: () => set({ isDirty: false, status: 'idle' }),

  toDiagram: () => {
    const { court, phase } = get();
    return { version: 1, court, phases: [phase], timeline: [] };
  },
}));
