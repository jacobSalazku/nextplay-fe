import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPlaysDocument } from '@/graphql/graphql';

export const getPlays = async (routeKey: string) => {
  const { getPlays } = await executeAuthedGraphQL(GetPlaysDocument, {
    input: {
      routeKey,
    },
  });

  return getPlays;
};
