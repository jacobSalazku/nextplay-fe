import type { PlacedObject } from '@/features/playbook/utils/diagram/types';

const OFFENSE_FILL = '#E8E6E0';
const OFFENSE_INK = '#181613';
const DEFENSE = '#DC3B33';
const BALL = '#F97316';
const STROKE = '#CFA068';

const R = 3.6;

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
        <circle r={R + 1.4} fill="none" stroke={BALL} strokeWidth={1} />
      )}
      <circle r={R} fill={OFFENSE_FILL} stroke={STROKE} strokeWidth={0.5} />
      <text
        y={1.4}
        textAnchor="middle"
        fontSize={4}
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
        strokeWidth={1}
        strokeLinecap="round"
      >
        <path d="M-7 -0.8 Q-4.6 -3.6 -2.6 -1.4" />
        <path d="M7 -0.8 Q4.6 -3.6 2.6 -1.4" />
      </g>
      <circle r={R} fill="#fff" stroke={DEFENSE} strokeWidth={1} />
      <text
        y={1.3}
        textAnchor="middle"
        fontSize={3.6}
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
