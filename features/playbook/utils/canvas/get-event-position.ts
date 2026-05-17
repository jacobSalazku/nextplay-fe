export const getEventPosition = (
  e: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement | null,
) => {
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;

  const x = ((clientX - rect.left) / rect.width) * 600;
  const y = ((clientY - rect.top) / rect.height) * 400;

  return { x, y };
};
