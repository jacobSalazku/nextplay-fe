import { useQuery } from '@apollo/client/react';
import {
  GetStatsPerGameDocument,
  GetStatsPerGameQuery,
  GetStatsPerGameQueryVariables,
} from '@/graphql/graphql';

export function useStatsPerGame(input: GetStatsPerGameQueryVariables['input']) {
  const { data, loading, error } = useQuery<
    GetStatsPerGameQuery,
    GetStatsPerGameQueryVariables
  >(GetStatsPerGameDocument, {
    variables: { input },
    skip: !input.routeKey || !input.memberId,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });

  return {
    statsPerGame: data?.getStatsPerGame ?? [],
    loading,
    error,
  };
}
