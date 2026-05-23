import { cache } from 'react';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetTeamDocument } from '@/graphql/graphql';

const TEAM_REVALIDATE_SECONDS = 180;

export const getTeamInforamtion = cache(async (routeKey: string) => {
  const { getTeam } = await executeAuthedGraphQL(
    GetTeamDocument,
    {
      input: {
        routeKey,
      },
    },
    {
      fetchOptions: {
        cache: 'force-cache',
        next: {
          revalidate: TEAM_REVALIDATE_SECONDS,
          tags: [`team:${routeKey}`, `statistics:${routeKey}`],
        },
      },
    },
  );

  return getTeam;
});
