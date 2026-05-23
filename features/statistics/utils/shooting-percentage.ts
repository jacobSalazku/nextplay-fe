import type { TeamStats } from '@/graphql/graphql';

export function calculateShootingPercentages(teamStatlist: TeamStats) {
  const twoPoints =
    (teamStatlist?.totalFieldGoalsMade ?? 0) +
    (teamStatlist?.totalFieldGoalsMissed ?? 0);

  const threePoints =
    (teamStatlist?.totalThreePointersMade ?? 0) +
    (teamStatlist?.totalThreePointersMissed ?? 0);

  const ftPoints =
    (teamStatlist?.totalFreeThrows ?? 0) +
    (teamStatlist?.totalFreeThrowsMissed ?? 0);

  const totalAttempts = twoPoints + threePoints + ftPoints;

  const round = (num: number) => Math.round(num * 100) / 100;

  return {
    twoPointsPercent:
      totalAttempts > 0
        ? round((twoPoints / totalAttempts) * 100).toFixed(1)
        : 0,
    threePointsPercent:
      totalAttempts > 0
        ? round((threePoints / totalAttempts) * 100).toFixed(1)
        : 0,
    ftPointsPercent:
      totalAttempts > 0
        ? round((ftPoints / totalAttempts) * 100).toFixed(1)
        : 0,
  };
}
