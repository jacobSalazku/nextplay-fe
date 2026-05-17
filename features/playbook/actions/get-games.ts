import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetGamesDocument } from '@/graphql/graphql';

export const getGames = async (teamRef: string) => {
  const { getGames } = await executeAuthedGraphQL(GetGamesDocument, {
    input: { teamRef },
  });

  return getGames;
};
