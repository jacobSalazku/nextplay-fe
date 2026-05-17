import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPracticesDocument } from '@/graphql/graphql';

export const getPractices = async (teamRef: string) => {
  const { getPractices } = await executeAuthedGraphQL(GetPracticesDocument, {
    input: { teamRef },
  });

  return getPractices
    .map((activity) => activity.practice)
    .filter((practice): practice is NonNullable<typeof practice> =>
      Boolean(practice),
    );
};
