import 'server-only';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetActivityDocument } from '@/graphql/graphql';

export const getActivity = async (routeKey: string, activityId: string) => {
  const { getActivity } = await executeAuthedGraphQL(GetActivityDocument, {
    input: {
      routeKey,
      activityId,
    },
  });

  return getActivity;
};
