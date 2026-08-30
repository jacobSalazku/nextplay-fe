import 'server-only';
import { cache } from 'react';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import {
  GetGamesWithBoxScoresDocument,
  GetGamesWithBoxScoresQueryVariables,
  GetStatlineAveragesDocument,
  GetStatlineAveragesQueryVariables,
  GetStatsPerGameDocument,
  GetStatsPerGameQueryVariables,
  GetTeamStatsDocument,
  GetTeamStatsQueryVariables,
  GetWeeklyTeamAveragesDocument,
  GetWeeklyTeamAveragesQueryVariables,
} from '@/graphql/graphql';

const STATS_REVALIDATE_SECONDS = 180;

const buildStatisticsFetchOptions = (
  routeKey: string,
  tags: string[] = [],
) => ({
  cache: 'force-cache' as const,
  next: {
    revalidate: STATS_REVALIDATE_SECONDS,
    tags: [`statistics:${routeKey}`, ...tags],
  },
});

export const getStatlineAverage = cache(
  async (input: GetStatlineAveragesQueryVariables['input']) => {
    const { getStatlineAverages } = await executeAuthedGraphQL(
      GetStatlineAveragesDocument,
      {
        input: {
          routeKey: input.routeKey,
        },
      },
      {
        fetchOptions: buildStatisticsFetchOptions(input.routeKey, [
          `statistics:${input.routeKey}:statline-averages`,
        ]),
      },
    );

    return getStatlineAverages;
  },
);

export const getTeamStats = cache(
  async (input: GetTeamStatsQueryVariables['input']) => {
    const { getTeamStats } = await executeAuthedGraphQL(
      GetTeamStatsDocument,
      {
        input: { routeKey: input.routeKey },
      },
      {
        fetchOptions: buildStatisticsFetchOptions(input.routeKey, [
          `statistics:${input.routeKey}:team-stats`,
        ]),
      },
    );

    return getTeamStats;
  },
);

export const getGamesWithBoxScores = cache(
  async (input: GetGamesWithBoxScoresQueryVariables['input']) => {
    const { getGamesWithBoxScores } = await executeAuthedGraphQL(
      GetGamesWithBoxScoresDocument,
      {
        input: {
          routeKey: input.routeKey,
        },
      },
      {
        fetchOptions: buildStatisticsFetchOptions(input.routeKey, [
          `statistics:${input.routeKey}:games-with-box-scores`,
        ]),
      },
    );

    return getGamesWithBoxScores;
  },
);

export const GetWeeklyTeamAverages = cache(
  async (input: GetWeeklyTeamAveragesQueryVariables['input']) => {
    const { getWeeklyTeamAverages } = await executeAuthedGraphQL(
      GetWeeklyTeamAveragesDocument,
      {
        input: {
          routeKey: input.routeKey,
        },
      },
      {
        fetchOptions: buildStatisticsFetchOptions(input.routeKey, [
          `statistics:${input.routeKey}:weekly-team-averages`,
        ]),
      },
    );

    return getWeeklyTeamAverages;
  },
);

export const getStatsPerGame = cache(
  async (input: GetStatsPerGameQueryVariables['input']) => {
    const gamesStatlines = await executeAuthedGraphQL(
      GetStatsPerGameDocument,
      {
        input: {
          ...input,
          routeKey: input.routeKey,
        },
      },
      {
        fetchOptions: buildStatisticsFetchOptions(input.routeKey, [
          `statistics:${input.routeKey}:stats-per-game`,
          `statistics:${input.routeKey}:player:${input.memberId}`,
        ]),
      },
    );

    return gamesStatlines;
  },
);
