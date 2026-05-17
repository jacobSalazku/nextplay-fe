export type Player = {
  id: string;
  position: string;
  x: number;
  y: number;
  color: string;
};

export type DrawingLine = {
  id: string;
  points: number[];
  color: string;
  tool: string;
};

export type CoachDashTab = "gameplan" | "play" | "practice";

export type PlanCardType = "gameplan" | "practice";
