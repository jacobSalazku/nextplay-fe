import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql/client-request';
import { GetWeeklyTeamAveragesDocument } from '@/graphql/graphql';

export function useWeeklyTeamAverages({ routeKey }: { routeKey: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weeklyTeamAverages', routeKey],
    queryFn: () =>
      gqlRequest(GetWeeklyTeamAveragesDocument, { input: { routeKey } }),
    enabled: Boolean(routeKey),
    placeholderData: keepPreviousData,
  });

  return {
    weeklyTeamAverages: data?.getWeeklyTeamAverages ?? [],
    loading: isLoading,
    error: error ?? undefined,
  };
}
