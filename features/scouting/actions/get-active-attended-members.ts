import 'server-only';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetActiveAttendedMembersDocument } from '@/graphql/graphql';

export const getActiveAttendedMembers = async (
  teamRef: string,
  activityId: string,
) => {
  const { getActiveAttendedMembers } = await executeAuthedGraphQL(
    GetActiveAttendedMembersDocument,
    {
      input: {
        teamRef,
        activityId,
      },
    },
  );

  return getActiveAttendedMembers;
};
