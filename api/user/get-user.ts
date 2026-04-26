import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetUserDocument } from '@/graphql/graphql';

export const getUser = async (teamShortId: string) => {
  const { getUserById } = await executeAuthedGraphQL(GetUserDocument, {
    teamShortId: teamShortId,
  });

  return getUserById;
};
