import type { StatlineData } from "../zod/player-stats";
import { defaultStatline } from "../zod/types";

export function sanitizeStatline(
  statline: Partial<StatlineData>,
): StatlineData {
  const clean: Partial<StatlineData> = {};

  for (const key of Object.keys(defaultStatline) as (keyof StatlineData)[]) {
    if (key === "id") continue;
    clean[key] = Math.max(0, Number(statline[key] ?? 0));
  }

  clean.id = statline.id ?? "";
  return clean as StatlineData;
}
