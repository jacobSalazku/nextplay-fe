import { Button } from "@/components/foundation/button/button";
import { cn } from "@/utils/tw-merge";
import type { FC } from "react";
import type { OpponentStatsline, StatlineData } from "../../zod/player-stats";

// Union of all possible stat keys
type AllStatKeys = keyof StatlineData | keyof OpponentStatsline;

type StatsButtonProps = {
  statKey: AllStatKeys;
  label: string;
  value: number;
  onIncrement: (key: AllStatKeys) => void;
  className?: string;
};

const StatButton: FC<StatsButtonProps> = ({
  statKey,
  label,
  value,
  onIncrement,
  className,
}) => (
  <Button
    type="button"
    variant="outline"
    onClick={() => onIncrement?.(statKey)}
    className={cn(
      className,
      "flex flex-col items-center justify-center rounded-xl border bg-gray-100 py-10 text-gray-950 shadow-sm hover:border-orange-400 hover:bg-transparent hover:text-white",
    )}
  >
    <span className="text-md font-medium">{label}</span>
    <span className="text-3xl font-bold">{value}</span>
  </Button>
);

export { StatButton };
