import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetTeamDocument } from '@/graphql/graphql';

export const getTeamInforamtion = async (teamShortId: string) => {
  const { getTeam } = await executeAuthedGraphQL(GetTeamDocument, {
    input: {
      routeKey: teamShortId,
    },
  });

  return getTeam;
};
