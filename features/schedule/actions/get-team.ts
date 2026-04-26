'server only';

import { cache } from 'react';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetTeamActivitiesDocument } from '@/graphql/graphql';

export const getTeam = cache(async (teamRef: string) => {
  const team = await executeAuthedGraphQL(GetTeamActivitiesDocument, {
    teamRef,
  });

  return team;
});
