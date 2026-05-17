import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetGameplanDocument } from '@/graphql/graphql';

export const getGameplan = async (routeKey: string) => {
  const { getGameplan } = await executeAuthedGraphQL(GetGameplanDocument, {
    input: { routeKey },
  });

  return getGameplan;
};
