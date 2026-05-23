import { useQuery } from '@apollo/client/react';
import {
  GetWeeklyTeamAveragesDocument,
  GetWeeklyTeamAveragesQuery,
  GetWeeklyTeamAveragesQueryVariables,
} from '@/graphql/graphql';

export function useWeeklyTeamAverages({ routeKey }: { routeKey: string }) {
  const variables: GetWeeklyTeamAveragesQueryVariables = {
    input: {
      routeKey,
    },
  };

  const { data, loading, error } = useQuery<
    GetWeeklyTeamAveragesQuery,
    GetWeeklyTeamAveragesQueryVariables
  >(GetWeeklyTeamAveragesDocument, {
    variables,
    skip: !routeKey,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  return {
    weeklyTeamAverages: data?.getWeeklyTeamAverages ?? [],
    loading,
    error,
  };
}
