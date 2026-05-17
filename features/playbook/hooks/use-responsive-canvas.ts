import { useEffect, useState } from 'react';

export const useResponsiveCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  const [canvasSize, setCanvasSize] = useState({
    width: 600,
    height: 400,
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const maxWidth = Math.min(containerWidth - 32, 600);
        const aspectRatio = 400 / 600;
        const newHeight = maxWidth * aspectRatio;
        setCanvasSize({ width: maxWidth, height: newHeight });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasRef]);

  return canvasSize;
};
