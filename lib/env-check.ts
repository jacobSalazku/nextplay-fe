const REQUIRED = ['BACKEND_GRAPHQL_URL', 'AUTH_SECRET'] as const;

export function findMissingEnv(
  env: Record<string, string | undefined> = process.env,
): string[] {
  return REQUIRED.filter((key) => {
    if (env[key]) return false;
    if (key === 'AUTH_SECRET' && env.NEXTAUTH_SECRET) return false;
    return true;
  });
}

export function assertServerEnv(
  env: Record<string, string | undefined> = process.env,
): void {
  const missing = findMissingEnv(env);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. See .env.example`,
    );
  }
}
