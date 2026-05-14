import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPendingMembersDocument } from '@/graphql/graphql';

export const getPendingMembers = async (teamRef: string) => {
  const { getPendingMembers } = await executeAuthedGraphQL(
    GetPendingMembersDocument,
    {
      input: {
        teamRef: teamRef,
      },
    },
  );

  return getPendingMembers;
};
