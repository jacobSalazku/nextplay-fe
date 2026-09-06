import 'server-only';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { PlayEditorConfigDocument } from '@/graphql/graphql';

export const getPlayEditorConfig = async () => {
  const { playEditorConfig } = await executeAuthedGraphQL(
    PlayEditorConfigDocument,
    {},
  );

  return playEditorConfig;
};
