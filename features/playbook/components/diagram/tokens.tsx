import type { PlacedObject } from '@/features/playbook/utils/diagram/types';

const OFFENSE_FILL = '#E8E6E0';
const OFFENSE_INK = '#181613';
const DEFENSE = '#DC3B33';
const BALL = '#F97316';
const STROKE = '#CFA068';

const R = 2.6;

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
        strokeWidth={0.9}
        strokeLinecap="round"
      >
        <path d="M-4.9 -0.6 Q-3.2 -2.5 -1.8 -1" />
        <path d="M4.9 -0.6 Q3.2 -2.5 1.8 -1" />
      </g>
      <circle r={R} fill="#fff" stroke={DEFENSE} strokeWidth={0.9} />
      <text
        y={1}
        textAnchor="middle"
        fontSize={2.7}
        fontWeight={700}
        fill={DEFENSE}
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
