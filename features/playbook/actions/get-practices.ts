import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPracticesDocument } from '@/graphql/graphql';

export const getPractices = async (routeKey: string) => {
  const { getPractices } = await executeAuthedGraphQL(GetPracticesDocument, {
    input: { routeKey },
  });

  return getPractices
    .map((activity) => activity.practice)
    .filter((practice): practice is NonNullable<typeof practice> =>
      Boolean(practice),
    );
};
