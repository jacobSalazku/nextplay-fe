import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql/client-request';
import {
  GetStatsPerGameDocument,
  type GetStatsPerGameQueryVariables,
} from '@/graphql/graphql';

export function useStatsPerGame(input: GetStatsPerGameQueryVariables['input']) {
  const enabled = Boolean(input.routeKey && input.memberId);

  const { data, isLoading, error } = useQuery({
    queryKey: ['statsPerGame', input],
    queryFn: () => gqlRequest(GetStatsPerGameDocument, { input }),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    statsPerGame: data?.getStatsPerGame ?? [],
    loading: isLoading,
    error: error ?? undefined,
  };
}
