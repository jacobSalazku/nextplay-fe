import type { OpponentStatsline, StatlineData } from '../zod/player-stats';
import { defaultOpponentStatline, defaultStatline } from '../zod/types';
import type { MemberWithStatlines } from '@/graphql/graphql';

export const getInitalPlayers = (
  players: MemberWithStatlines[],
  activityId: string,
) => {
  return players.map((p) => {
    const statlineForActivity = p.statlines?.find(
      (s) => s.activityId === activityId,
    );
    return {
      ...p,
      statlines: statlineForActivity
        ? [statlineForActivity]
        : [{ ...defaultStatline, activityId }],
    };
  });
};

export const getInitialOpponentStatline = (
  opponentStatline: OpponentStatsline,
  activityId: string,
): OpponentStatsline => {
  if (opponentStatline && opponentStatline.activityId === activityId) {
    return opponentStatline;
  }
  return { ...defaultOpponentStatline, activityId };
};

export const calculateRawTeamStats = (players: MemberWithStatlines[]) => {
  return players.reduce(
    (acc: StatlineData, player) => {
      // For each player, get their first statline or a default empty statline
      const s: StatlineData = player.statlines?.[0] ?? { ...defaultStatline };

      // Loop over all keys in defaultStatline (which define stat fields)
      for (const key of Object.keys(
        defaultStatline,
      ) as (keyof StatlineData)[]) {
        if (key !== 'id') {
          // Add the player's stat value to the accumulator for each field except 'id'
          acc[key] = (acc[key] ?? 0) + (s[key] ?? 0);
        }
      }

      // Return accumulated stats for next iteration
      return acc;
    },
    { ...defaultStatline } as StatlineData,
  );
};
