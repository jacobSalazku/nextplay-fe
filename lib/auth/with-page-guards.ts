import 'server-only';

import { type ReactNode } from 'react';
import { requireAccessToken, userHasOnBoarded } from './require-acces-token';

type ServerPage<Props extends object = object> = (
  props: Props,
) => Promise<ReactNode> | ReactNode;

export function withProtectedPage<Props extends object = object>(
  page: ServerPage<Props>,
): ServerPage<Props> {
  return async function ProtectedPage(props: Props) {
    await requireAccessToken();
    return page(props);
  };
}

export function withCreateFlowPage<Props extends object = object>(
  page: ServerPage<Props>,
): ServerPage<Props> {
  return async function CreateFlowPage(props: Props) {
    await userHasOnBoarded();
    return page(props);
  };
}
