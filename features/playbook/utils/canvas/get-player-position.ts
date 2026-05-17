import type { Player } from "../types";

export const getPlayerAtPosition = (
  x: number,
  y: number,
  players: Player[],
) => {
  return players.find((player) => {
    const distance = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
    return distance <= 25;
  });
};
