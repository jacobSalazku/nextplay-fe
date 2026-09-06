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
  CourtType,
  Phase,
  PlacedObject,
  Point,
} from '@/features/playbook/diagram/types';
import type { EditorTool, Selection } from '@/store/use-play-editor-store';
import { nearestToken } from './draw-geometry';
import { useCourtPointer } from './use-court-pointer';

type DrawEnd = { toId: string } | { toPoint: Point };

type Props = {
  court: CourtType;
  phase: Phase;
  ballHolderId?: string;
  tool: EditorTool;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDraw: (fromId: string, end: DrawEnd) => void;
};

const SNAP_RADIUS = 6; // court units — drop an endpoint onto a nearby token
const MIN_DRAW_LEN = 4; // court units — discard shorter drags
const TOKEN_HIT_R = 5; // court units — the invisible grab circle

type Interaction =
  | { kind: 'move'; id: string; frame: number; last: Point }
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
  onMove,
  onDraw,
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

  const selectedObjectId = selection?.kind === 'object' ? selection.id : null;
  const selectedActionId = selection?.kind === 'action' ? selection.id : null;

  const drawing = tool !== 'select';

  const startInteraction =
    (object: PlacedObject) => (event: React.PointerEvent) => {
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

    if (current.kind === 'move') {
      current.last = point;
      cancelAnimationFrame(current.frame);
      current.frame = requestAnimationFrame(() =>
        onMove(current.id, current.last.x, current.last.y),
      );
    } else {
      setPreview({ from: current.from, to: point });
    }
  };

  const endInteraction = (event: React.PointerEvent) => {
    const current = interaction.current;
    interaction.current = null;
    setPreview(null);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const point = toCourt(event);
    if (!current || !point) return;

    if (current.kind === 'move') {
      cancelAnimationFrame(current.frame);
      onMove(current.id, point.x, point.y);
      return;
    }

    const length = Math.hypot(
      point.x - current.from.x,
      point.y - current.from.y,
    );
    if (length < MIN_DRAW_LEN) return;

    const hit = nearestToken(point, phase.objects, SNAP_RADIUS, current.fromId);
    onDraw(
      current.fromId,
      hit
        ? { toId: hit.id }
        : { toPoint: { x: clamp(point.x), y: clamp(point.y) } },
    );
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
                stroke={active ? 'rgb(251 146 60)' : 'transparent'}
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
            stroke="rgb(251 146 60)"
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
            stroke={
              selectedObjectId === object.id ? 'rgb(251 146 60)' : 'transparent'
            }
            strokeWidth={selectedObjectId === object.id ? 1 : 0}
            style={{ cursor: drawing ? 'crosshair' : 'grab' }}
            onPointerDown={startInteraction(object)}
          />
        ))}
      </svg>
    </div>
  );
}
