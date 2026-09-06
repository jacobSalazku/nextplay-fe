'use client';

import { useRef, useState } from 'react';
import { COURT_VIEWBOX } from '@/features/playbook/diagram/court';
import { CourtDiagram } from '@/features/playbook/diagram/court-diagram';
import {
  actionEndpoints,
  ARROW_ACTIONS,
  routePath,
} from '@/features/playbook/diagram/geometry';
import { courtScaleY, projectPhase } from '@/features/playbook/diagram/project';
import { RouteArrowMarker } from '@/features/playbook/diagram/route';
import type {
  Action,
  CourtType,
  Phase,
  PlacedObject,
  Point,
} from '@/features/playbook/diagram/types';
import type { EditorTool, Selection } from '@/store/use-play-editor-store';
import {
  actionChord,
  angleTo,
  bendHandle,
  bendOffset,
  nearestToken,
} from './draw-geometry';
import { useCourtPointer } from './use-court-pointer';

type DrawEnd = { toId: string } | { toPoint: Point };
type Chord = { from: Point; to: Point };

type Props = {
  court: CourtType;
  phase: Phase;
  ballHolderId?: string;
  tool: EditorTool;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDraw: (fromId: string, end: DrawEnd) => void;
  onBend: (actionId: string, bend: Point | undefined) => void;
  onRotate: (id: string, facing: number) => void;
  onDelete: () => void;
};

const SNAP_RADIUS = 6; // court units — drop an endpoint onto a nearby token
const MIN_DRAW_LEN = 4; // court units — discard shorter drags
const TOKEN_HIT_R = 5; // court units — the invisible grab circle
const ROTATE_ARM = 9; // court units — rotation handle distance from the token
const ACCENT = 'rgb(251 146 60)';

type Interaction =
  | { kind: 'move'; id: string; frame: number; last: Point }
  | { kind: 'bend'; id: string; chord: Chord; frame: number; last: Point }
  | { kind: 'rotate'; id: string; center: Point; frame: number; last: Point }
  | { kind: 'draw'; fromId: string; from: Point }
  | null;

const clamp = (n: number) => Math.min(100, Math.max(0, n));
const rad = (deg: number) => (deg * Math.PI) / 180;

export function EditorStage({
  court,
  phase,
  ballHolderId,
  tool,
  selection,
  onSelect,
  onMove,
  onDraw,
  onBend,
  onRotate,
  onDelete,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const toCourt = useCourtPointer(boxRef);
  const interaction = useRef<Interaction>(null);
  const [preview, setPreview] = useState<{ from: Point; to: Point } | null>(
    null,
  );

  const { w, h } = COURT_VIEWBOX[court];
  const sy = courtScaleY(court);
  const projected = projectPhase(phase, court);

  const drawing = tool !== 'select';
  const selectedObjectId = selection?.kind === 'object' ? selection.id : null;
  const selectedActionId = selection?.kind === 'action' ? selection.id : null;
  const selectedAction = selectedActionId
    ? (phase.actions.find((a) => a.id === selectedActionId) ?? null)
    : null;
  const selectedObject = selectedObjectId
    ? (phase.objects.find((o) => o.id === selectedObjectId) ?? null)
    : null;
  const selectedDefender =
    selectedObject?.kind === 'defense' ? selectedObject : null;

  const commit = (current: NonNullable<Interaction>, point: Point) => {
    if (current.kind === 'move') onMove(current.id, point.x, point.y);
    else if (current.kind === 'bend')
      onBend(current.id, bendOffset(current.chord, point) ?? undefined);
    else if (current.kind === 'rotate')
      onRotate(current.id, angleTo(current.center, point));
  };

  const beginDrag = (
    event: React.PointerEvent,
    next: NonNullable<Interaction>,
  ) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    interaction.current = next;
  };

  const startToken = (object: PlacedObject) => (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const from = { x: object.x, y: object.y };

    if (drawing) {
      interaction.current = { kind: 'draw', fromId: object.id, from };
      setPreview({ from, to: toCourt(event) ?? from });
    } else {
      onSelect({ kind: 'object', id: object.id });
      interaction.current = {
        kind: 'move',
        id: object.id,
        frame: 0,
        last: from,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = interaction.current;
    if (!current) return;
    const point = toCourt(event);
    if (!point) return;

    if (current.kind === 'draw') {
      setPreview({ from: current.from, to: point });
      return;
    }

    current.last = point;
    cancelAnimationFrame(current.frame);
    current.frame = requestAnimationFrame(() => commit(current, current.last));
  };

  const endInteraction = (event: React.PointerEvent) => {
    const current = interaction.current;
    interaction.current = null;
    setPreview(null);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const point = toCourt(event);
    if (!current || !point) return;

    if (current.kind === 'draw') {
      const length = Math.hypot(
        point.x - current.from.x,
        point.y - current.from.y,
      );
      if (length < MIN_DRAW_LEN) return;

      const hit = nearestToken(
        point,
        phase.objects,
        SNAP_RADIUS,
        current.fromId,
      );
      onDraw(
        current.fromId,
        hit
          ? { toId: hit.id }
          : { toPoint: { x: clamp(point.x), y: clamp(point.y) } },
      );
      return;
    }

    cancelAnimationFrame(current.frame);
    commit(current, point);
  };

  return (
    <div
      ref={boxRef}
      className="relative w-full touch-none select-none"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <CourtDiagram
        court={court}
        phase={phase}
        ballHolderId={ballHolderId}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        role="application"
        aria-label="Play editor canvas"
        onPointerMove={onPointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
      >
        <defs>
          <RouteArrowMarker />
        </defs>

        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="transparent"
          onPointerDown={() => !drawing && onSelect(null)}
        />

        {!drawing &&
          projected.actions.map((action) => {
            const ends = actionEndpoints(action, projected.objects);
            if (!ends) return null;
            const active = selectedActionId === action.id;
            return (
              <path
                key={action.id}
                d={routePath(action.type, ends.a, ends.b, ends.ctrl)}
                fill="none"
                stroke={active ? ACCENT : 'transparent'}
                strokeOpacity={active ? 0.6 : 1}
                strokeWidth={active ? 2 : 6}
                strokeLinecap="round"
                style={{ pointerEvents: 'all', cursor: 'pointer' }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onSelect({ kind: 'action', id: action.id });
                }}
              />
            );
          })}

        {preview && tool !== 'select' && (
          <path
            d={routePath(
              tool,
              { x: preview.from.x, y: preview.from.y * sy },
              { x: preview.to.x, y: preview.to.y * sy },
              null,
            )}
            fill="none"
            stroke={ACCENT}
            strokeWidth={1}
            strokeDasharray="2 2"
            strokeLinecap="round"
            markerEnd={
              ARROW_ACTIONS.has(tool) ? 'url(#route-arrow)' : undefined
            }
          />
        )}

        {phase.objects.map((object) => (
          <circle
            key={object.id}
            role="button"
            aria-label={`${drawing ? 'Draw from' : 'Move'} ${object.label}`}
            cx={object.x}
            cy={object.y * sy}
            r={TOKEN_HIT_R}
            fill="transparent"
            stroke={selectedObjectId === object.id ? ACCENT : 'transparent'}
            strokeWidth={selectedObjectId === object.id ? 1 : 0}
            style={{ cursor: drawing ? 'crosshair' : 'grab' }}
            onPointerDown={startToken(object)}
          />
        ))}

        {selectedAction && (
          <ActionHandles
            action={selectedAction}
            objects={phase.objects}
            sy={sy}
            onBendPointerDown={(event, chord) =>
              beginDrag(event, {
                kind: 'bend',
                id: selectedAction.id,
                chord,
                frame: 0,
                last: chord.from,
              })
            }
            onDelete={onDelete}
          />
        )}

        {selectedDefender && (
          <RotationHandle
            object={selectedDefender}
            sy={sy}
            onPointerDown={(event) =>
              beginDrag(event, {
                kind: 'rotate',
                id: selectedDefender.id,
                center: { x: selectedDefender.x, y: selectedDefender.y },
                frame: 0,
                last: { x: selectedDefender.x, y: selectedDefender.y },
              })
            }
          />
        )}
      </svg>
    </div>
  );
}

function ActionHandles({
  action,
  objects,
  sy,
  onBendPointerDown,
  onDelete,
}: {
  action: Action;
  objects: PlacedObject[];
  sy: number;
  onBendPointerDown: (event: React.PointerEvent, chord: Chord) => void;
  onDelete: () => void;
}) {
  const chord = actionChord(action, objects);
  const handle = bendHandle(action, objects);
  if (!chord || !handle) return null;

  return (
    <>
      <circle
        role="button"
        aria-label="Bend route"
        cx={handle.x}
        cy={handle.y * sy}
        r={2.4}
        fill={ACCENT}
        stroke="white"
        strokeWidth={0.4}
        style={{ cursor: 'grab' }}
        onPointerDown={(event) => onBendPointerDown(event, chord)}
      />
      <DeleteControl
        x={handle.x + 5}
        y={handle.y * sy - 5}
        onDelete={onDelete}
      />
    </>
  );
}

function RotationHandle({
  object,
  sy,
  onPointerDown,
}: {
  object: PlacedObject;
  sy: number;
  onPointerDown: (event: React.PointerEvent) => void;
}) {
  const facing = object.facing ?? 0;
  const hx = object.x + Math.cos(rad(facing)) * ROTATE_ARM;
  const hy = object.y + Math.sin(rad(facing)) * ROTATE_ARM;

  return (
    <>
      <line
        x1={object.x}
        y1={object.y * sy}
        x2={hx}
        y2={hy * sy}
        stroke={ACCENT}
        strokeWidth={0.5}
      />
      <circle
        role="button"
        aria-label="Rotate defender"
        cx={hx}
        cy={hy * sy}
        r={2.2}
        fill={ACCENT}
        stroke="white"
        strokeWidth={0.4}
        style={{ cursor: 'grab' }}
        onPointerDown={onPointerDown}
      />
    </>
  );
}

function DeleteControl({
  x,
  y,
  onDelete,
}: {
  x: number;
  y: number;
  onDelete: () => void;
}) {
  return (
    <g
      role="button"
      aria-label="Delete"
      transform={`translate(${x} ${y})`}
      style={{ cursor: 'pointer' }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onDelete();
      }}
    >
      <circle r={2.6} fill="rgb(220 38 38)" />
      <path
        d="M-1 -1 L1 1 M-1 1 L1 -1"
        stroke="white"
        strokeWidth={0.6}
        strokeLinecap="round"
      />
    </g>
  );
}
