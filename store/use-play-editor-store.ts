import type {
  Action,
  CourtType,
  Phase,
  PlacedObject,
  PlayActionType,
  PlayDiagram,
  PlayObjectKind,
  Point,
} from '@/features/playbook/utils/diagram/types';
import {
  makeSlotObject,
  manToManPosition,
  MAX_PER_SIDE,
  ROSTER_SIZE,
  slotKind,
  slotNumber,
} from '@/features/playbook/utils/editor/roster';
import { create } from 'zustand';

export type EditorTool = 'select' | PlayActionType;
export type Selection = { kind: 'object' | 'action'; id: string } | null;

const MAX_ACTIONS = 30;
const HISTORY_CAP = 50;

const newActionId = () => `a${Math.random().toString(36).slice(2, 9)}`;

// Armed by beginEdit() on pointer-down and consumed by the first drag mutation,
// so a whole drag is a single undo step. Module-level: the store is a singleton.
let pendingSnapshot: Phase | null = null;

type RosterCount = Record<PlayObjectKind, number>;

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
  rosterCount: RosterCount;
  tool: EditorTool;
  selection: Selection;
  isDirty: boolean;
  history: Phase[];
  future: Phase[];

  hydrate: (input: HydrateInput) => void;
  reset: () => void;
  setTool: (tool: EditorTool) => void;
  select: (selection: Selection) => void;
  beginEdit: () => void;
  endEdit: () => void;
  moveObject: (id: string, x: number, y: number) => void;
  rotateObject: (id: string, facing: number) => void;
  benchObject: (id: string) => void;
  unbenchObject: (id: string) => void;
  addSlot: (kind: PlayObjectKind) => void;
  matchManToMan: () => void;
  setBallHolder: (id: string) => void;
  addAction: (action: Omit<Action, 'id'>) => boolean;
  updateAction: (id: string, patch: { bend?: Point }) => void;
  deleteAction: (id: string) => void;
  undo: () => void;
  redo: () => void;
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
  rosterCount: { offense: ROSTER_SIZE, defense: ROSTER_SIZE } as RosterCount,
  tool: 'select' as EditorTool,
  selection: null as Selection,
  isDirty: false,
  history: [] as Phase[],
  future: [] as Phase[],
};

const patchById = <T extends { id: string }>(
  list: T[],
  id: string,
  patch: (item: T) => T,
): T[] => list.map((item) => (item.id === id ? patch(item) : item));

const withoutBall = (phase: Phase): Phase => {
  const next = { ...phase };
  delete next.ballHolderId;
  return next;
};

const rosterCountFor = (objects: PlacedObject[]): RosterCount => ({
  offense: Math.max(
    ROSTER_SIZE,
    ...objects.filter((o) => o.kind === 'offense').map((o) => slotNumber(o.id)),
  ),
  defense: Math.max(
    ROSTER_SIZE,
    ...objects.filter((o) => o.kind === 'defense').map((o) => slotNumber(o.id)),
  ),
});

// Editor state for one play. A singleton, so `<PlayEditor>` hydrates it for the
// current play and resets on unmount. In-flight save state lives with the
// mutation hook, not here. One phase for now — the phase strip comes later.
export const usePlayEditorStore = create<PlayEditorState>((set, get) => {
  const clipHistory = (list: Phase[]) => list.slice(-HISTORY_CAP);

  // A discrete edit: snapshot the current phase, then apply.
  const commitPhase = (fn: (phase: Phase) => Phase) =>
    set((state) => ({
      isDirty: true,
      history: clipHistory([...state.history, state.phase]),
      future: [],
      phase: fn(state.phase),
    }));

  // A drag edit: the snapshot was armed by beginEdit(); commit it on the first
  // mutation so the whole drag collapses to one undo step.
  const editPhase = (fn: (phase: Phase) => Phase) =>
    set((state) => {
      const armed = pendingSnapshot;
      pendingSnapshot = null;
      return {
        isDirty: true,
        ...(armed
          ? { history: clipHistory([...state.history, armed]), future: [] }
          : {}),
        phase: fn(state.phase),
      };
    });

  return {
    ...initialState,

    hydrate: ({ playId, routeKey, name, diagram }) => {
      pendingSnapshot = null;
      set({
        ...initialState,
        hydrated: true,
        playId,
        routeKey,
        name,
        court: diagram.court,
        phase: diagram.phases[0],
        rosterCount: rosterCountFor(diagram.phases[0].objects),
      });
    },

    reset: () => {
      pendingSnapshot = null;
      set(initialState);
    },

    setTool: (tool) => set({ tool, selection: null }),

    select: (selection) => set({ selection }),

    beginEdit: () => {
      pendingSnapshot = get().phase;
    },

    endEdit: () => {
      pendingSnapshot = null;
    },

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

    benchObject: (id) => {
      if (!get().phase.objects.some((o) => o.id === id)) return;
      commitPhase((phase) => {
        const next: Phase = {
          ...phase,
          objects: phase.objects.filter((o) => o.id !== id),
          actions: phase.actions.filter(
            (a) => a.fromId !== id && a.toId !== id,
          ),
        };
        return phase.ballHolderId === id ? withoutBall(next) : next;
      });
      set((state) =>
        state.selection?.kind === 'object' && state.selection.id === id
          ? { selection: null }
          : {},
      );
    },

    unbenchObject: (id) => {
      if (get().phase.objects.some((o) => o.id === id)) return;
      const object = makeSlotObject(slotKind(id), slotNumber(id));
      commitPhase((phase) => ({
        ...phase,
        objects: [...phase.objects, object],
      }));
    },

    addSlot: (kind) => {
      const count = get().rosterCount[kind];
      if (count >= MAX_PER_SIDE) return;
      set({ rosterCount: { ...get().rosterCount, [kind]: count + 1 } });
      get().unbenchObject(makeSlotObject(kind, count + 1).id);
    },

    matchManToMan: () => {
      const { phase } = get();
      const offense = phase.objects.filter((o) => o.kind === 'offense');
      const onCourt = new Set(
        phase.objects.filter((o) => o.kind === 'defense').map((o) => o.id),
      );
      const added = offense
        .map((o) => ({ o, id: `x${slotNumber(o.id)}` }))
        .filter(({ id }) => !onCourt.has(id))
        .map(({ o, id }) => ({
          id,
          kind: 'defense' as const,
          label: o.label,
          ...manToManPosition(o),
        }));
      if (!added.length) return;

      const maxN = Math.max(
        get().rosterCount.defense,
        ...added.map((d) => slotNumber(d.id)),
      );
      set({
        rosterCount: {
          ...get().rosterCount,
          defense: Math.min(MAX_PER_SIDE, maxN),
        },
      });
      commitPhase((p) => ({ ...p, objects: [...p.objects, ...added] }));
    },

    setBallHolder: (id) => {
      if (!get().phase.objects.some((o) => o.id === id)) return;
      commitPhase((phase) =>
        phase.ballHolderId === id
          ? withoutBall(phase)
          : { ...phase, ballHolderId: id },
      );
    },

    addAction: (input) => {
      if (get().phase.actions.length >= MAX_ACTIONS) return false;

      const action: Action = { ...input, id: newActionId() };
      commitPhase((phase) => ({
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
      commitPhase((phase) => ({
        ...phase,
        actions: phase.actions.filter((action) => action.id !== id),
      }));
      set((state) =>
        state.selection?.kind === 'action' && state.selection.id === id
          ? { selection: null }
          : {},
      );
    },

    undo: () => {
      const { history, phase, future } = get();
      if (!history.length) return;
      set({
        phase: history[history.length - 1],
        history: history.slice(0, -1),
        future: [phase, ...future].slice(0, HISTORY_CAP),
        isDirty: true,
        selection: null,
      });
    },

    redo: () => {
      const { history, phase, future } = get();
      if (!future.length) return;
      set({
        phase: future[0],
        history: clipHistory([...history, phase]),
        future: future.slice(1),
        isDirty: true,
        selection: null,
      });
    },

    // Success only — a failed save must leave isDirty set so the coach can retry.
    // History resets on save: you can't undo past a saved state.
    markSaved: () => set({ isDirty: false, history: [], future: [] }),

    toDiagram: () => {
      const { court, phase } = get();
      return { version: 1, court, phases: [phase], timeline: [] };
    },
  };
});
