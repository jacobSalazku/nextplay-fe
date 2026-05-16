import { z } from "zod";

const statField = () =>
  z.preprocess((val) => Number(val ?? 0), z.number().int().nonnegative());

export const statlineSchema = z.object({
  id: z.string(),
  fieldGoalsMade: statField(),
  fieldGoalsMissed: statField(),
  threePointersMade: statField(),
  threePointersMissed: statField(),
  freeThrows: statField(),
  missedFreeThrows: statField(),
  assists: statField(),
  steals: statField(),
  turnovers: statField(),
  offensiveRebounds: statField(),
  defensiveRebounds: statField(),
  blocks: statField(),
});

export const opponentStatlineSchema = z.object({
  name: z.string(),
  fieldGoalsMade: statField(),
  threePointersMade: statField(),
  freeThrowsMade: statField(),
  activityId: z.string(),
});

export const playerWithStats = z.object({
  id: z.string(),
  activityId: z.string(),
  statlines: z.array(statlineSchema),
});

export const createStatlineInputSchema = z.object({
  teamId: z.string(),
  players: z.array(playerWithStats),
  opponentStatline: opponentStatlineSchema,
});

export const playersDataSchema = z.object({
  players: z.array(playerWithStats),
});

export type CreateStatlineInput = z.infer<typeof createStatlineInputSchema>;

export type StatlineData = z.infer<typeof statlineSchema>;

export type OpponentStatsline = z.infer<typeof opponentStatlineSchema>;
