const SHORT_ID_PATTERN = /^[a-z0-9]{6,12}$/;

export type ParsedRouteKey = {
  slug: string;
  shortId: string;
};

export function slugifyTeamName(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug.length > 0 ? slug : 'team';
}

export function parseRouteKey(routeKey: string): ParsedRouteKey | null {
  const normalized = routeKey.trim().toLowerCase();
  const segments = normalized
    .split('-')
    .filter((segment) => segment.length > 0);
  const shortId = segments.at(-1);

  if (!shortId || !SHORT_ID_PATTERN.test(shortId)) {
    return null;
  }

  const slug = segments.slice(0, -1).join('-') || 'team';

  return { slug, shortId };
}

export function getTeamShortId(routeKey: string): string | null {
  return parseRouteKey(routeKey)?.shortId ?? null;
}

export function buildRouteKey(input: { slug: string; shortId: string }): string {
  return `${slugifyTeamName(input.slug)}-${input.shortId.toLowerCase()}`;
}
