// The small red × shown next to a selected route's bend handle.
export function DeleteControl({
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
      style={{ pointerEvents: 'all', cursor: 'pointer' }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onDelete();
      }}
    >
      <circle r={3} fill="transparent" />
      <circle r={1.1} fill="rgb(220 38 38)" />
      <path
        d="M-0.5 -0.5 L0.5 0.5 M-0.5 0.5 L0.5 -0.5"
        stroke="white"
        strokeWidth={0.4}
        strokeLinecap="round"
      />
    </g>
  );
}
