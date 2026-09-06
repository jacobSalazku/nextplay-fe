#!/usr/bin/env sh
# Boots nextplay-be for the Playwright flow specs: migrate, seed, serve on :3001.
# Used by playwright.config.ts when E2E_BACKEND_DIR is set (CI, or local opt-in).
set -e

BE_DIR="${E2E_BACKEND_DIR:?set E2E_BACKEND_DIR to the nextplay-be checkout}"
cd "$BE_DIR"

: "${DATABASE_URL:?set DATABASE_URL}"
export DIRECT_URL="${DIRECT_URL:-$DATABASE_URL}"
export DEV_AUTH_ENABLED=true
export PORT=3001

if [ -z "${JWT_PRIVATE_KEY_BASE64:-}" ]; then
  eval "$(node -e '
    const { generateKeyPairSync } = require("crypto");
    const k = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const b64 = (s) => Buffer.from(s).toString("base64");
    process.stdout.write(`export JWT_PRIVATE_KEY_BASE64=${b64(k.privateKey)}\n`);
    process.stdout.write(`export JWT_PUBLIC_KEY_BASE64=${b64(k.publicKey)}\n`);
  ')"
fi

[ -d node_modules ] || pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm exec prisma migrate deploy
node prisma/seed.js
exec node_modules/.bin/nest start
