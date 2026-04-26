import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export const boxScoreSearchParams = {
  activityId: parseAsString.withDefault(''),
  id: parseAsString.withDefault(''),
};

export const playbookSearchParams = {
  id: parseAsString.withDefault(''),
};

export const gameplanSearchParams = {
  id: parseAsString.withDefault(''),
};

export const practiceSearchParams = {
  id: parseAsString.withDefault(''),
};

export const playerProfileSearchParams = {
  id: parseAsString.withDefault(''),
};

export const playerProfileSearchParamsCache = createSearchParamsCache(
  playerProfileSearchParams,
);

export const gameplanSearchParamsCache =
  createSearchParamsCache(gameplanSearchParams);

export const practiceSearchParamsCache =
  createSearchParamsCache(practiceSearchParams);

export const playbookSearchParamsCache =
  createSearchParamsCache(playbookSearchParams);

export const boxScoreSearchParamsCache =
  createSearchParamsCache(boxScoreSearchParams);
