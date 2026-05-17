import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetGamesDocument } from '@/graphql/graphql';

export const getGames = async (routeKey: string) => {
  const { getGames } = await executeAuthedGraphQL(GetGamesDocument, {
    input: { routeKey },
  });

  return getGames;
};
