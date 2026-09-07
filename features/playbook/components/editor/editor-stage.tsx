'use client';

import { useRef, useState } from 'react';
import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import { RouteArrowMarker } from '@/features/playbook/components/diagram/route';
import { useCourtPointer } from '@/features/playbook/hooks/editor/use-court-pointer';
import {
  actionEndpoints,
  ARROW_ACTIONS,
  routePath,
} from '@/features/playbook/utils/diagram/geometry';
import {
  courtScaleY,
  projectPhase,
} from '@/features/playbook/utils/diagram/project';
import type {
  CourtType,
  Phase,
  PlacedObject,
  Point,
} from '@/features/playbook/utils/diagram/types';
import { ACCENT, BALL } from '@/features/playbook/utils/editor/colors';
import {
  angleTo,
  bendOffset,
  nearestToken,
  type Chord,
} from '@/features/playbook/utils/editor/draw-geometry';
import type { EditorTool, Selection } from '@/store/use-play-editor-store';
import { ActionHandles } from './handles/action-handles';
import { RotationHandle } from './handles/rotation-handle';

type DrawEnd = { toId: string } | { toPoint: Point };

type Props = {
  court: CourtType;
  phase: Phase;
  ballHolderId?: string;
  tool: EditorTool;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onPickSelect: () => void;
  onBeginEdit: () => void;
  onEndEdit: () => void;
  onMove: (id: string, x: number, y: number) => void;
  onDraw: (fromId: string, end: DrawEnd) => void;
  onBend: (actionId: string, bend: Point | undefined) => void;
  onRotate: (id: string, facing: number) => void;
  onSetBall: (id: string) => void;
  onDelete: () => void;
};

const SNAP_RADIUS = 6; // court units — drop an endpoint onto a nearby token
const MIN_DRAW_LEN = 4; // court units — discard shorter drags
const TOKEN_HIT_R = 5; // court units — the invisible grab circle

type Interaction =
  | { kind: 'move'; id: string; grab: Point; frame: number; last: Point }
  | { kind: 'bend'; id: string; chord: Chord; frame: number; last: Point }
  | { kind: 'rotate'; id: string; center: Point; frame: number; last: Point }
  | { kind: 'draw'; fromId: string; from: Point }
  | null;

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export function EditorStage({
  court,
  phase,
  ballHolderId,
  tool,
  selection,
  onSelect,
  onPickSelect,
  onBeginEdit,
  onEndEdit,
  onMove,
  onDraw,
  onBend,
  onRotate,
  onSetBall,
  onDelete,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  // the box is locked to the court's aspect ratio, so the court fills it with
  // no letterbox and the box maps straight to court space
  const toCourt = useCourtPointer(boxRef, null);
  const interaction = useRef<Interaction>(null);
  const { w, h } = COURT_VIEWBOX[court];
  const [preview, setPreview] = useState<{ from: Point; to: Point } | null>(
    null,
  );

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
    if (current.kind === 'move')
      onMove(
        current.id,
        clamp(point.x - current.grab.x),
        clamp(point.y - current.grab.y),
      );
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
    onBeginEdit();
    interaction.current = next;
  };

  const startToken = (object: PlacedObject) => (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const from = { x: object.x, y: object.y };
    const point = toCourt(event);

    if (drawing) {
      interaction.current = { kind: 'draw', fromId: object.id, from };
      setPreview({ from, to: point ?? from });
    } else {
      onSelect({ kind: 'object', id: object.id });
      onBeginEdit();
      // keep the point you grabbed under the cursor instead of snapping the
      // token's centre to it
      const grab = point
        ? { x: point.x - object.x, y: point.y - object.y }
        : { x: 0, y: 0 };
      interaction.current = {
        kind: 'move',
        id: object.id,
        grab,
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
    onEndEdit();
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const point = toCourt(event);
    if (!current || !point) return;

    if (current.kind === 'draw') {
      const length = Math.hypot(
        point.x - current.from.x,
        point.y - current.from.y,
      );
      // a click (not a drag) on a token while a draw tool is active =
      // select that player and drop back to the select tool
      if (length < MIN_DRAW_LEN) {
        onSelect({ kind: 'object', id: current.fromId });
        onPickSelect();
        return;
      }

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
      className="relative h-full max-w-full touch-none select-none"
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
          style={{ pointerEvents: 'all' }}
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
                strokeWidth={active ? 1 : 6}
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
            strokeWidth={0.55}
            strokeDasharray="1.2 1.2"
            strokeLinecap="round"
            markerEnd={
              ARROW_ACTIONS.has(tool) ? 'url(#route-arrow)' : undefined
            }
          />
        )}

        {phase.objects.map((object) => (
          <g key={object.id}>
            {selectedObjectId === object.id && (
              <circle
                cx={object.x}
                cy={object.y * sy}
                r={3.4}
                fill="none"
                stroke={ACCENT}
                strokeWidth={0.5}
                style={{ pointerEvents: 'none' }}
              />
            )}
            <circle
              role="button"
              aria-label={`${drawing ? 'Draw from' : 'Move'} ${object.kind === 'defense' ? 'defender' : 'player'} ${object.label}`}
              cx={object.x}
              cy={object.y * sy}
              r={TOKEN_HIT_R}
              fill="transparent"
              style={{
                pointerEvents: 'all',
                cursor: 'pointer',
              }}
              onPointerDown={startToken(object)}
            />
            {object.kind === 'offense' && !drawing && (
              <circle
                role="button"
                aria-label={
                  ballHolderId === object.id
                    ? `Take the ball from ${object.label}`
                    : `Give the ball to ${object.label}`
                }
                cx={object.x + 1.9}
                cy={object.y * sy + 1.9}
                r={1.1}
                fill={ballHolderId === object.id ? BALL : 'white'}
                stroke={ballHolderId === object.id ? 'white' : '#CFA068'}
                strokeWidth={0.4}
                style={{ pointerEvents: 'all', cursor: 'pointer' }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onSetBall(object.id);
                }}
              />
            )}
          </g>
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
