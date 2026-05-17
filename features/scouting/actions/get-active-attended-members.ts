import 'server-only';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetActiveAttendedMembersDocument } from '@/graphql/graphql';

export const getActiveAttendedMembers = async (
  routeKey: string,
  activityId: string,
) => {
  const { getActiveAttendedMembers } = await executeAuthedGraphQL(
    GetActiveAttendedMembersDocument,
    {
      input: {
        routeKey,
        activityId,
      },
    },
  );

  return getActiveAttendedMembers;
};
