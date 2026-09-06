export type CourtType = 'half' | 'full';

export type PlayObjectKind = 'offense' | 'defense';

export type PlayActionType =
  | 'dribble'
  | 'pass'
  | 'cut'
  | 'screen'
  | 'shot'
  | 'handoff';

export type Point = { x: number; y: number };

export type PlacedObject = {
  id: string;
  kind: PlayObjectKind;
  label: string;
  x: number;
  y: number;
  facing?: number;
};

export type Action = {
  id: string;
  type: PlayActionType;
  fromId: string;
  toId?: string;
  toPoint?: Point;
  bend?: Point;
};

export type Phase = {
  id: string;
  note?: string;
  ballHolderId?: string;
  objects: PlacedObject[];
  actions: Action[];
};

export type Step = {
  id: string;
  actionIds: string[];
  durationMs: number;
};

export type PlayDiagram = {
  version: 1;
  court: CourtType;
  phases: Phase[];
  timeline: Step[];
};
