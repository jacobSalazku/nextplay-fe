import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPlaysDocument } from '@/graphql/graphql';

export const getPlays = async (teamRef: string) => {
  const { getPlays } = await executeAuthedGraphQL(GetPlaysDocument, {
    input: {
      teamRef,
    },
  });

  return getPlays;
};
