import type { MemberWithStatlines } from '@/graphql/graphql';
import type { OpponentStatsline, StatlineData } from './player-stats';

export type PlayerWithStats = MemberWithStatlines & {
  statlines: StatlineData[];
};

export const defaultStatline: StatlineData = {
  id: '',
  fieldGoalsMade: 0,
  fieldGoalsMissed: 0,
  threePointersMade: 0,
  threePointersMissed: 0,
  freeThrows: 0,
  missedFreeThrows: 0,
  assists: 0,
  steals: 0,
  turnovers: 0,
  offensiveRebounds: 0,
  defensiveRebounds: 0,
  blocks: 0,
};

export const defaultOpponentStatline: OpponentStatsline = {
  name: '',
  fieldGoalsMade: 0,
  threePointersMade: 0,
  freeThrowsMade: 0,
  activityId: '',
};
