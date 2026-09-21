#!/usr/bin/env bash
# Push Supabase Auth URL allow-list + optional Google OAuth to the linked project.
# Requires: SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
#
# Optional (enable Google):
#   GOOGLE_OAUTH_CLIENT_ID
#   GOOGLE_OAUTH_CLIENT_SECRET
#
# Usage:
#   SUPABASE_ACCESS_TOKEN=sbp_... ./scripts/configure-supabase-auth.sh
#   SUPABASE_ACCESS_TOKEN=sbp_... GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_CLIENT_SECRET=... ./scripts/configure-supabase-auth.sh

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-oqelvlqbpngqfioipcbg}"
SITE_URL="${MAGALI_SITE_URL:-https://www.magali.store}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens"
  exit 1
fi

REDIRECTS="http://localhost:3000/api/auth/callback,${SITE_URL}/api/auth/callback"

export SITE_URL REDIRECTS
PAYLOAD=$(node - <<NODE
const site = process.env.SITE_URL;
const redirects = process.env.REDIRECTS;
const body = {
  site_url: site,
  uri_allow_list: redirects,
};
if (process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
  body.external_google_enabled = true;
  body.external_google_client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  body.external_google_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
}
console.log(JSON.stringify(body));
NODE
)

echo "Updating Supabase Auth config for project ${PROJECT_REF}..."
curl -fsS -X PATCH \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${PAYLOAD}"

echo ""
echo "Done. Redirect allow-list:"
echo "  - http://localhost:3000/api/auth/callback"
echo "  - ${SITE_URL}/api/auth/callback"
if [[ -n "${GOOGLE_OAUTH_CLIENT_ID:-}" ]]; then
  echo "Google provider: enabled"
else
  echo "Google provider: unchanged (set GOOGLE_OAUTH_CLIENT_ID + GOOGLE_OAUTH_CLIENT_SECRET to enable)"
fi
