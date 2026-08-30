'use server';

import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import {
  CreateGameDocument,
  CreatePracticeDocument,
  DeleteActivityDocument,
  UpdateGameDocument,
  UpdatePracticeDocument,
  type CreateGameMutationVariables,
  type CreatePracticeMutationVariables,
  type DeleteActivityMutationVariables,
  type UpdateGameMutationVariables,
  type UpdatePracticeMutationVariables,
} from '@/graphql/graphql';

export type ActionResult = { ok: true } | { ok: false; error: string };

async function run(call: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await call();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}

export async function createGame(
  input: CreateGameMutationVariables['input'],
): Promise<ActionResult> {
  return run(() => executeAuthedGraphQL(CreateGameDocument, { input }));
}

export async function updateGame(
  input: UpdateGameMutationVariables['input'],
): Promise<ActionResult> {
  return run(() => executeAuthedGraphQL(UpdateGameDocument, { input }));
}

export async function createPractice(
  input: CreatePracticeMutationVariables['input'],
): Promise<ActionResult> {
  return run(() => executeAuthedGraphQL(CreatePracticeDocument, { input }));
}

export async function updatePractice(
  input: UpdatePracticeMutationVariables['input'],
): Promise<ActionResult> {
  return run(() => executeAuthedGraphQL(UpdatePracticeDocument, { input }));
}

export async function deleteActivity(
  input: DeleteActivityMutationVariables['input'],
): Promise<ActionResult> {
  return run(() => executeAuthedGraphQL(DeleteActivityDocument, { input }));
}
