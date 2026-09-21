# Google sign-in setup (Magali)

Supabase project: **`oqelvlqbpngqfioipcbg`**

Auth logs showed **`provider is not enabled`** — Google must be turned on in Supabase with valid OAuth credentials.

## 1. Google Cloud Console

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. **Create credentials → OAuth client ID → Web application**.
3. **Authorized JavaScript origins**
   - `https://www.magali.store`
   - `http://localhost:3000` (local dev)
4. **Authorized redirect URIs** (Supabase only — not your Next app):
   - `https://oqelvlqbpngqfioipcbg.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client secret**.

## 2. Supabase (dashboard or script)

### Option A — Script (recommended)

1. Create a [Supabase access token](https://supabase.com/dashboard/account/tokens).
2. Run from repo root:

```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."
export GOOGLE_OAUTH_CLIENT_ID="....apps.googleusercontent.com"
export GOOGLE_OAUTH_CLIENT_SECRET="...."
./scripts/configure-supabase-auth.sh
```

This sets:

- Site URL: `https://www.magali.store`
- Redirect URLs: `http://localhost:3000/api/auth/callback`, `https://www.magali.store/api/auth/callback`
- Google provider: enabled with your client ID/secret

### Option B — Dashboard

1. [URL configuration](https://supabase.com/dashboard/project/oqelvlqbpngqfioipcbg/auth/url-configuration)
   - Site URL: `https://www.magali.store`
   - Redirect URLs (exact, one per line):
     - `http://localhost:3000/api/auth/callback`
     - `https://www.magali.store/api/auth/callback`
2. [Providers → Google](https://supabase.com/dashboard/project/oqelvlqbpngqfioipcbg/auth/providers?provider=Google)
   - Enable Google
   - Paste Client ID and Client secret from step 1

## 3. Verify

1. Local: `/account/login` → **Continue with Google** → lands on `/account`.
2. Production: same on `https://www.magali.store/account/login`.

The app uses **`/api/auth/callback`** without query strings; post-login destination is stored in a short-lived cookie (`magali_auth_next`).
