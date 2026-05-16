import 'server-only';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetActivityDocument } from '@/graphql/graphql';

export const getActivity = async (teamRef: string, activityId: string) => {
  const { getActivity } = await executeAuthedGraphQL(GetActivityDocument, {
    input: {
      teamRef,
      activityId,
    },
  });

  return getActivity;
};
