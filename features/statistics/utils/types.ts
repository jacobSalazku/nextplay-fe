export type Week = {
  label: string;
  start: string;
  end: string;
  month: number;
  startDate: Date;
  endDate: Date;
};

export type StatSelect =
  | 'assists'
  | 'rebounds'
  | 'blocks'
  | 'fieldGoalsMade'
  | 'fieldGoalsMissed'
  | 'threePointersMade'
  | 'threePointersMissed'
  | 'freeThrows'
  | 'freeThrowsMissed'
  | 'steals'
  | 'turnovers';

export type ActivityStat = {
  value: number | undefined;
  date: string | null;
  title: string | null;
};

export type PlayerStatRow = {
  name: string;
  memberId: string;
  gamesPlayed: number;
  points: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
  assists: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  blocks: number;
  steals: number;
  turnovers: number;
};
