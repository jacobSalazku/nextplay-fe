const INK = '#1E1B16';

export function RouteArrowMarker() {
  return (
    <marker
      id="route-arrow"
      viewBox="0 0 8 8"
      refX="6"
      refY="4"
      markerWidth="2.4"
      markerHeight="2.4"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L8 4 L0 8 Z" fill={INK} />
    </marker>
  );
}
