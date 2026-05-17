import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPlayDocument } from '@/graphql/graphql';

export const getPlay = async (id: string) => {
  const { getPlay } = await executeAuthedGraphQL(GetPlayDocument, {
    input: {
      id,
    },
  });

  return getPlay;
};
