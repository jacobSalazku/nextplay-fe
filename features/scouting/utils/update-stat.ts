import type { StatlineData } from "../zod/player-stats";

export function calculateStats(stats: StatlineData) {
  // Field Goals
  const fieldGoalsMade =
    (stats.fieldGoalsMade ?? 0) + (stats.threePointersMade ?? 0);

  const fieldGoalsAttemped =
    fieldGoalsMade +
    (stats.fieldGoalsMissed ?? 0) +
    (stats.threePointersMissed ?? 0);

  const fieldGoalPercentage = (
    (fieldGoalsMade / (fieldGoalsAttemped || 1)) *
    100
  ).toFixed(0);

  // Three Pointers
  const threePointMade = stats.threePointersMade ?? 0;
  const threePointAttempted = threePointMade + (stats.threePointersMissed ?? 0);

  const threePointPercentage = (
    (threePointMade / (threePointAttempted || 1)) *
    100
  ).toFixed(0);

  // Free Throws
  const freeThrowsMade = stats.freeThrows ?? 0;
  const freeThrowsAttempted = freeThrowsMade + (stats.missedFreeThrows ?? 0);

  const freeThrowPercentage = (
    (freeThrowsMade / (freeThrowsAttempted || 1)) *
    100
  ).toFixed(0);

  const fieldGoals = {
    made: fieldGoalsMade,
    attempted: fieldGoalsAttemped,
    percentage: fieldGoalPercentage,
  };
  const threePointers = {
    made: threePointMade,
    attempted: threePointAttempted,
    percentage: threePointPercentage,
  };
  const freeThrows = {
    made: freeThrowsMade,
    attempted: freeThrowsAttempted,
    percentage: freeThrowPercentage,
  };

  const totalPoints =
    (fieldGoalsMade - threePointMade) * 2 + threePointMade * 3 + freeThrowsMade;

  return {
    fieldGoals,
    threePointers,
    freeThrows,
    totalPoints,
  };
}

export function analyzeTeamStats(totalTeamStats: StatlineData) {
  // Field Goals
  const teamFieldGoalsMade =
    (totalTeamStats.fieldGoalsMade ?? 0) +
    (totalTeamStats.threePointersMade ?? 0);

  const teamFieldGoalsAttempted =
    (totalTeamStats.fieldGoalsMade ?? 0) +
    (totalTeamStats.threePointersMade ?? 0) +
    (totalTeamStats.threePointersMissed ?? 0) +
    (totalTeamStats.fieldGoalsMissed ?? 0);

  const teamFieldGoalPercentage = (
    (teamFieldGoalsMade / teamFieldGoalsAttempted) *
    100
  ).toFixed(0);

  //3 Pointers
  const teamThreePointMade = totalTeamStats.threePointersMade ?? 0;

  const teamThreePointAttempted =
    (teamThreePointMade ?? 0) + (totalTeamStats.threePointersMissed ?? 0);

  const teamThreePointPercentage = (
    (teamThreePointMade / teamThreePointAttempted) *
    100
  ).toFixed(0);

  // Free Throws
  const teamFreeThrowsMade = totalTeamStats.freeThrows ?? 0;

  const teamFreeThrowsAttempted =
    teamFreeThrowsMade + (totalTeamStats.missedFreeThrows ?? 0);

  const teamFreeThrowPercentage = (
    (teamFreeThrowsMade / teamFreeThrowsAttempted) *
    100
  ).toFixed(0);

  const fieldGoals = {
    made: teamFieldGoalsMade,
    attempted: teamFieldGoalsAttempted,
    percentage: teamFieldGoalPercentage,
  };
  const threePointers = {
    made: teamThreePointMade,
    attempted: teamThreePointAttempted,
    percentage: teamThreePointPercentage,
  };
  const freeThrows = {
    made: teamFreeThrowsMade,
    attempted: teamFreeThrowsAttempted,
    percentage: teamFreeThrowPercentage,
  };

  const totalTeamPoints =
    (teamFieldGoalsMade - teamThreePointMade) * 2 +
    teamThreePointMade * 3 +
    teamFreeThrowsMade;

  return {
    fieldGoals,
    threePointers,
    freeThrows,
    totalPoints: totalTeamPoints,
  };
}
