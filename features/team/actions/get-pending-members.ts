import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPendingMembersDocument } from '@/graphql/graphql';

export const getPendingMembers = async (routeKey: string) => {
  const { getPendingMembers } = await executeAuthedGraphQL(
    GetPendingMembersDocument,
    {
      input: {
        routeKey: routeKey,
      },
    },
  );

  return getPendingMembers;
};
