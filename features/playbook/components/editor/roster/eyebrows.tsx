// The defender "arms up" glyph on an opponent chip.
export function Eyebrows() {
  return (
    <svg
      viewBox="-10 -8 20 8"
      className="pointer-events-none absolute top-1.5 h-2 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
    >
      <path d="M-8 -1 Q-5 -5 -2 -2" />
      <path d="M8 -1 Q5 -5 2 -2" />
    </svg>
  );
}
