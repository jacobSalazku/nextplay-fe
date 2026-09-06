import { useCallback } from 'react';
import { getEventPosition } from '@/features/playbook/utils/canvas/get-event-position';
import { getPlayerAtPosition } from '@/features/playbook/utils/canvas/get-player-position';
import type { DrawingLine, Player } from '@/features/playbook/utils/types';

type ToolType = 'select' | 'pass' | 'movement';

type InteractionParams = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentTool: ToolType;
  currentColor: string;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setDrawingLines: React.Dispatch<React.SetStateAction<DrawingLine[]>>;
  setIsDrawing: (val: boolean) => void;
  setIsDragging: (val: boolean) => void;
  setDraggedPlayer: (id: string | null) => void;
  isDragging: boolean;
  isDrawing: boolean;
  draggedPlayer: string | null;
};

export const useInteractionHandlers = ({
  canvasRef,
  currentTool,
  currentColor,
  players,
  setPlayers,
  setDrawingLines,
  setIsDrawing,
  setIsDragging,
  setDraggedPlayer,
  isDragging,
  isDrawing,
  draggedPlayer,
}: InteractionParams) => {
  const startInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const { x, y } = getEventPosition(e, canvasRef.current);

      if (currentTool === 'select') {
        const player = getPlayerAtPosition(x, y, players);
        if (player) {
          setIsDragging(true);
          setDraggedPlayer(player.id);
          return;
        }
      }

      if (currentTool !== 'select') {
        setIsDrawing(true);
        const newLine: DrawingLine = {
          id: Date.now().toString(),
          points: [x, y],
          color: currentColor,
          tool: currentTool,
        };
        setDrawingLines((prev) => [...prev, newLine]);
      }
    },
    [
      currentTool,
      currentColor,
      canvasRef,
      players,
      setDrawingLines,
      setIsDrawing,
      setIsDragging,
      setDraggedPlayer,
    ],
  );

  const continueInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const { x, y } = getEventPosition(e, canvasRef.current);

      if (isDragging && draggedPlayer) {
        const constrainedX = Math.max(25, Math.min(575, x));
        const constrainedY = Math.max(25, Math.min(375, y));

        setPlayers((prev) =>
          prev.map((player) =>
            player.id === draggedPlayer
              ? { ...player, x: constrainedX, y: constrainedY }
              : player,
          ),
        );
        return;
      }

      if (!isDrawing || currentTool === 'select') return;

      setDrawingLines((prev) => {
        const newLines = [...prev];
        const lastLine = newLines[newLines.length - 1];
        if (lastLine) {
          lastLine.points = [...lastLine.points, x, y];
        }
        return newLines;
      });
    },
    [
      currentTool,
      isDragging,
      draggedPlayer,
      isDrawing,
      canvasRef,
      setPlayers,
      setDrawingLines,
    ],
  );

  return { startInteraction, continueInteraction };
};
