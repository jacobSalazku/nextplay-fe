import type { StatlineData } from '../zod/player-stats';

export const statRows: { key: keyof StatlineData; label: string }[] = [
  { key: 'fieldGoalsMade', label: 'FGM' },
  { key: 'fieldGoalsMissed', label: 'FG Missed' },
  { key: 'threePointersMade', label: '3PM' },
  { key: 'threePointersMissed', label: '3P Missed' },
  { key: 'freeThrows', label: 'FTM' },
  { key: 'missedFreeThrows', label: 'FT Missed' },
  { key: 'offensiveRebounds', label: 'ORB' },
  { key: 'defensiveRebounds', label: 'DRB' },
  { key: 'assists', label: 'AST' },
  { key: 'steals', label: 'STL' },
  { key: 'blocks', label: 'BLK' },
  { key: 'turnovers', label: 'TO' },
];

export const statKeys: (keyof StatlineData)[] = [
  'fieldGoalsMade',
  'fieldGoalsMissed',
  'threePointersMade',
  'threePointersMissed',
  'freeThrows',
  'missedFreeThrows',
  'assists',
  'steals',
  'turnovers',
  'offensiveRebounds',
  'defensiveRebounds',
  'blocks',
];

export const otherStats = [
  { key: 'assists', label: 'AST' },
  { key: 'offensiveRebounds', label: 'REB' },
  { key: 'blocks', label: 'BLK' },
  { key: 'steals', label: 'STL' },
  { key: 'turnovers', label: 'TO' },
];
