'server only';

import { cache } from 'react';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetTeamActivitiesDocument } from '@/graphql/graphql';

export const getTeam = cache(async (routeKey: string) => {
  const team = await executeAuthedGraphQL(GetTeamActivitiesDocument, {
    routeKey,
  });

  return team;
});
