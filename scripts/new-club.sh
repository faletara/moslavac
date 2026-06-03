#!/usr/bin/env bash
#
# new-club.sh — scaffolda novi klub iz apps/template.
#
#   bash scripts/new-club.sh <slug> [port]
#
# Primjer:
#   bash scripts/new-club.sh nk-primjer 3004
#
# Što radi:
#   1. Kopira apps/template -> apps/<slug> (bez node_modules/.next/.turbo/.env.local)
#   2. Postavi package.json: name "@moslavac/<slug>" i dev/start port
#   3. Generira apps/<slug>/.env.local iz .env.example (PAYLOAD_TENANT_SLUG, NEXT_PUBLIC_SITE_URL)
#   4. Ispiše preostale ručne korake
#
set -euo pipefail

# --- repo root (skripta je u <root>/scripts/) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- args ---
SLUG="${1:-}"
PORT="${2:-3004}"

if [[ -z "$SLUG" ]]; then
  echo "Greška: nedostaje slug." >&2
  echo "Korištenje: bash scripts/new-club.sh <slug> [port]" >&2
  exit 1
fi

if [[ ! "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  echo "Greška: slug smije sadržavati samo mala slova, brojeve i crtice (npr. nk-primjer)." >&2
  exit 1
fi

if [[ ! "$PORT" =~ ^[0-9]+$ ]]; then
  echo "Greška: port mora biti broj." >&2
  exit 1
fi

TEMPLATE_DIR="$ROOT/apps/template"
TARGET_DIR="$ROOT/apps/$SLUG"

if [[ ! -d "$TEMPLATE_DIR" ]]; then
  echo "Greška: ne postoji apps/template na $TEMPLATE_DIR" >&2
  exit 1
fi

if [[ -e "$TARGET_DIR" ]]; then
  echo "Greška: apps/$SLUG već postoji — prekidam (idempotentno)." >&2
  exit 1
fi

echo "→ Kopiram apps/template → apps/$SLUG ..."
rsync -a \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.turbo' \
  --exclude '.env.local' \
  "$TEMPLATE_DIR/" "$TARGET_DIR/"

# --- package.json: name + port ---
echo "→ Postavljam package.json (name @moslavac/$SLUG, port $PORT) ..."
PKG="$TARGET_DIR/package.json"
# name
perl -0777 -pi -e "s{\"name\":\s*\"\@moslavac/template\"}{\"name\": \"\@moslavac/$SLUG\"}" "$PKG"
# port (template koristi 3003 u dev/dev:clean/start)
perl -0777 -pi -e "s{-p 3003}{-p $PORT}g" "$PKG"

# --- .env.local ---
echo "→ Generiram .env.local ..."
ENV_OUT="$TARGET_DIR/.env.local"
{
  echo "NEXT_PUBLIC_SITE_URL=http://localhost:$PORT"
  echo "PAYLOAD_TENANT_SLUG=$SLUG"
  echo "PAYLOAD_API_URL=http://localhost:3002/api"
  echo "PAYLOAD_API_KEY="
  echo "HNS_API_BASE=https://api-hns.analyticom.de"
} > "$ENV_OUT"

cat <<EOF

✅ Gotovo: apps/$SLUG kreiran (port $PORT).

Preostali ručni koraci:
  1. Kreiraj Tenant zapis u Payload CMS-u (http://localhost:3002/admin):
       slug = $SLUG
       displayName, hns.apiKey, hns.teamId, branding/contact/payment/legal
  2. Upiši PAYLOAD_API_KEY u apps/$SLUG/.env.local (API-key korisnik iz Payloada).
  3. Zamijeni placeholder assete u apps/$SLUG/public/:
       grb.png, naslovna.jpg, dres.png, fans.jpg, game.jpg, uplatnica.png
     i ikone apps/$SLUG/src/app/{icon.png,apple-icon.png}.
  4. Instaliraj i pokreni:
       pnpm install
       pnpm --filter @moslavac/$SLUG dev
  5. Deploy na Vercel: novi projekt, Root Directory = apps/$SLUG,
     postavi env vars (uklj. NEXT_PUBLIC_SITE_URL na pravu domenu).
EOF
