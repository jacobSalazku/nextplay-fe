import { useCallback } from "react";
import type { DrawingLine, Player } from "../utils/types";

export const useCanvasDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  courtImgRef: React.MutableRefObject<HTMLImageElement | null>,
  canvasSize: { width: number; height: number },
  players: Player[],
  drawingLines: DrawingLine[],
) => {
  const drawPlayers = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number) => {
      players.forEach((player) => {
        const x = player.x * scale;
        const y = player.y * scale;
        const radius = 20 * scale;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(player.position, x, y);
      });
    },
    [players],
  );

  const drawCourt = useCallback(() => {
    const canvas = canvasRef.current;
    const courtImg = courtImgRef.current;
    if (!canvas || !courtImg) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const scaleX = canvas.width / 600;
    const scaleY = canvas.height / 400;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(courtImg, 0, 0, canvas.width, canvas.height);

    drawingLines.forEach((line) => {
      if (line.points.length > 2) {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = (line.tool === "pen" ? 3 : 5) * scaleX;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(line.points[0]! * scaleX, line.points[1]! * scaleY);
        for (let i = 2; i < line.points.length; i += 2) {
          ctx.lineTo(line.points[i]! * scaleX, line.points[i + 1]! * scaleY);
        }
        ctx.stroke();
      }
    });

    drawPlayers(ctx, scaleX);
  }, [canvasSize, drawingLines, drawPlayers, canvasRef, courtImgRef]);

  return { drawCourt };
};
