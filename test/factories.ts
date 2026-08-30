import { Category, type Play } from '@/graphql/graphql';

let seq = 0;
const uniq = () => `test-${(seq++).toString(36)}`;

export function makePlay(overrides: Partial<Play> = {}): Play {
  const id = uniq();
  return {
    __typename: 'Play',
    id,
    name: `Play ${id}`,
    description: '',
    canvas: '/placeholder.png',
    category: Category.Offensive,
    routeKey: 'team-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
