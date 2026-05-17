import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetGameplanDocument } from '@/graphql/graphql';

export const getGameplan = async (teamRef: string) => {
  const { getGameplan } = await executeAuthedGraphQL(GetGameplanDocument, {
    input: { teamRef },
  });

  return getGameplan;
};
