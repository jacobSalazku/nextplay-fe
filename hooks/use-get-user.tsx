'use client';

import { useQuery } from '@apollo/client/react';
import { useSession } from 'next-auth/react';
import {
  GetUserDocument,
  type GetUserQuery,
  type GetUserQueryVariables,
} from '@/graphql/graphql';

export function useGetUser(teamShortId: string | null) {
  const { data: session, status } = useSession();

  const hasAccessToken =
    !!session &&
    'accessToken' in session &&
    typeof session.accessToken === 'string' &&
    session.accessToken.length > 0;

  const canQuery =
    status === 'authenticated' && hasAccessToken && !!teamShortId;

  return useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
    variables: { teamShortId: teamShortId ?? '' },
    skip: !canQuery,
    fetchPolicy: 'cache-and-network',
  });
}
