import { z } from 'zod';

export const getPlayerStatSchema = z.object({
  memberId: z.string(),
  activityId: z.string(),
  stat: z.enum([
    'assists',
    'rebounds',
    'blocks',
    'fieldGoalsMade',
    'fieldGoalsMissed',
    'threePointersMade',
    'threePointersMissed',
    'freeThrows',
    'freeThrowsMissed',
    'steals',
    'turnovers',
  ]),
  startDate: z.string(),
  endDate: z.string(),
});

export const getPointsPerGameStatSchema = z.object({
  memberId: z.string(),
  activityId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const getAllPlayerStats = z.object({
  routeKey: z.string(),
  activityId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type GetPlayerStatInput = z.infer<typeof getPlayerStatSchema>;

export type GetPointsPerGameStatInput = z.infer<
  typeof getPointsPerGameStatSchema
>;

export type GetAllPlayerStatsInput = z.infer<typeof getAllPlayerStats>;
