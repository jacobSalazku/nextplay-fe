import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import {
  actionEndpoints,
  ARROW_ACTIONS,
  routePath,
} from '@/features/playbook/utils/diagram/geometry';
import { projectPhase } from '@/features/playbook/utils/diagram/project';
import type {
  CourtType,
  Phase,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Marker,
  Path,
  Rect,
  Stop,
  Svg,
  Text,
} from '@react-pdf/renderer';

// The play diagram rebuilt with @react-pdf's own SVG primitives — vector, no
// SVG-string round-trip, no react-dom/server, and the wood gradient renders.

const LINE = '#8a8a8a';
const LINE_FAINT = '#b3b3b3';
const INK = '#1e1b16';
const OFFENSE_FILL = '#e8e6e0';
const OFFENSE_INK = '#181613';
const DEFENSE = '#dc3b33';
const BALL = '#f97316';
const RIM = '#cfa068';
const R = 2.6;
const DR = 2.1;

const DASH: Partial<Record<string, string>> = {
  pass: '1.3 1.1',
  shot: '0.3 1.4',
};

function HalfCourtLines() {
  return (
    <G fill="none" stroke={LINE} strokeWidth={0.5} strokeLinecap="round">
      <Line x1={3} y1={3} x2={97} y2={3} />
      <Line x1={3} y1={3} x2={3} y2={94} />
      <Line x1={97} y1={3} x2={97} y2={94} />

      <Rect x={34} y={3} width={32} height={38} fill="none" stroke={LINE} />
      <Circle cx={50} cy={41} r={12} fill="none" stroke={LINE} />

      <Line x1={43} y1={11} x2={57} y2={11} strokeWidth={0.8} />
      <Circle cx={50} cy={13.5} r={1.4} fill="none" stroke={LINE} />
      <Path d="M42 13.5 A8 8 0 0 0 58 13.5" stroke={LINE_FAINT} />

      <Path d="M9 3 V37.5 A47.5 47.5 0 0 0 91 37.5 V3" />
      <Circle cx={50} cy={94} r={12} fill="none" stroke={LINE_FAINT} />

      <G stroke={LINE_FAINT}>
        <Line x1={32} y1={15} x2={34} y2={15} />
        <Line x1={32} y1={23} x2={34} y2={23} />
        <Line x1={32} y1={31} x2={34} y2={31} />
        <Line x1={66} y1={15} x2={68} y2={15} />
        <Line x1={66} y1={23} x2={68} y2={23} />
        <Line x1={66} y1={31} x2={68} y2={31} />
      </G>
    </G>
  );
}

function TokenPdf({
  object,
  hasBall,
}: {
  object: PlacedObject;
  hasBall: boolean;
}) {
  if (object.kind === 'defense') {
    return (
      <G transform={`translate(${object.x} ${object.y})`}>
        <Circle r={DR} fill={DEFENSE} />
        <Text
          x={0}
          y={0.85}
          style={{
            fontFamily: 'Helvetica-Bold',
            fontSize: 2.3,
            textAnchor: 'middle',
            fill: '#ffffff',
          }}
        >
          {object.label}
        </Text>
      </G>
    );
  }
  return (
    <G transform={`translate(${object.x} ${object.y})`}>
      {hasBall && (
        <Circle r={R + 1} fill="none" stroke={BALL} strokeWidth={0.7} />
      )}
      <Circle r={R} fill={OFFENSE_FILL} stroke={RIM} strokeWidth={0.4} />
      <Text
        x={0}
        y={1}
        style={{
          fontFamily: 'Helvetica-Bold',
          fontSize: 2.7,
          textAnchor: 'middle',
          fill: OFFENSE_INK,
        }}
      >
        {object.label}
      </Text>
    </G>
  );
}

export function CourtPdf({
  court,
  phase,
  width,
}: {
  court: CourtType;
  phase: Phase;
  width: number;
}) {
  const { w, h } = COURT_VIEWBOX[court];
  const projected = projectPhase(phase, court);

  return (
    <Svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ce9e62" />
          <Stop offset="1" stopColor="#b98850" />
        </LinearGradient>
        <Marker
          id="arrow"
          viewBox="0 0 8 8"
          refX={6}
          refY={4}
          markerWidth={2.4}
          markerHeight={2.4}
          orient="auto-start-reverse"
        >
          <Path d="M0 0 L8 4 L0 8 Z" fill={INK} />
        </Marker>
      </Defs>

      <Rect x={0} y={0} width={w} height={h} rx={2} fill="url(#wood)" />

      <HalfCourtLines />
      {court === 'full' && (
        <G transform={`translate(0 ${h}) scale(1 -1)`}>
          <HalfCourtLines />
        </G>
      )}

      {projected.actions.map((action) => {
        const ends = actionEndpoints(action, projected.objects);
        if (!ends) return null;
        return (
          <Path
            key={action.id}
            d={routePath(action.type, ends.a, ends.b, ends.ctrl)}
            fill="none"
            stroke={INK}
            strokeWidth={0.45}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={DASH[action.type]}
            markerEnd={
              ARROW_ACTIONS.has(action.type) ? 'url(#arrow)' : undefined
            }
          />
        );
      })}

      {projected.objects.map((object) => (
        <TokenPdf
          key={object.id}
          object={object}
          hasBall={object.id === phase.ballHolderId}
        />
      ))}
    </Svg>
  );
}
