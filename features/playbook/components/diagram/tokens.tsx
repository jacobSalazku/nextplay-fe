import type { PlacedObject } from '@/features/playbook/utils/diagram/types';

const OFFENSE_FILL = '#E8E6E0';
const OFFENSE_INK = '#181613';
const DEFENSE = '#DC3B33';
const BALL = '#F97316';
const STROKE = '#CFA068';

const R = 2.6; // offense token radius
const DR = 2.1; // defenders sit a touch smaller

function OffenseToken({
  object,
  hasBall,
}: {
  object: PlacedObject;
  hasBall: boolean;
}) {
  return (
    <g transform={`translate(${object.x} ${object.y})`}>
      {hasBall && (
        <circle r={R + 1} fill="none" stroke={BALL} strokeWidth={0.7} />
      )}
      <circle r={R} fill={OFFENSE_FILL} stroke={STROKE} strokeWidth={0.4} />
      <text
        y={1}
        textAnchor="middle"
        fontSize={2.7}
        fontWeight={700}
        fill={OFFENSE_INK}
      >
        {object.label}
      </text>
    </g>
  );
}

function DefenseToken({ object }: { object: PlacedObject }) {
  const facing = object.facing ?? 0;
  return (
    <g transform={`translate(${object.x} ${object.y})`}>
      <g
        transform={`rotate(${facing})`}
        fill="none"
        stroke={DEFENSE}
        strokeWidth={0.75}
        strokeLinecap="round"
      >
        <path d="M-3.9 -0.5 Q-2.6 -2 -1.4 -0.8" />
        <path d="M3.9 -0.5 Q2.6 -2 1.4 -0.8" />
      </g>
      <circle r={DR} fill={DEFENSE} />
      <text
        y={0.85}
        textAnchor="middle"
        fontSize={2.3}
        fontWeight={700}
        fill="#fff"
      >
        {object.label}
      </text>
    </g>
  );
}

export function Token({
  object,
  hasBall,
}: {
  object: PlacedObject;
  hasBall: boolean;
}) {
  return object.kind === 'offense' ? (
    <OffenseToken object={object} hasBall={hasBall} />
  ) : (
    <DefenseToken object={object} />
  );
}
