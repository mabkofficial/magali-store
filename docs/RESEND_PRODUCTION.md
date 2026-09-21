# Resend production setup (magali.store)

Use this after you have access to the [Resend](https://resend.com) account and GoDaddy DNS for **shop.magali.store** (verified sending subdomain).

## 1. Create an API key

1. Resend Dashboard → **API Keys** → **Create API Key**.
2. Name it `magali-store-production` (or `magali-store-test` while testing).
3. Copy the key (`re_…`) once — it is shown only once.
4. Add to Vercel → **magali-store** → **Settings** → **Environment Variables**:
   - `RESEND_API_KEY` = `re_…` (Production, Preview, Development)
5. Redeploy production.

## 2. Set the inbox

Add **`CONTACT_TO_EMAIL`** in Vercel to the mailbox that should receive:

- Contact form submissions
- “New order to fulfill” alerts

Example: the client’s operations email or `mabkofficial@gmail.com` during launch.

Redeploy after saving.

## 3. Verify magali.store (required for customer-facing mail)

While `RESEND_FROM_EMAIL` is `Magali <onboarding@resend.dev>`, Resend is for **limited testing only**. For real customers, verify your domain:

1. Resend → **Domains** → **Add Domain** → `shop.magali.store`.
2. Resend shows DNS records (DKIM TXT, SPF CNAMEs, optional MX for inbound).
3. In **GoDaddy** → DNS for `magali.store`, add each record using Resend’s **Name** column as the host/label (e.g. `resend._domainkey.shop`, `rsend.shop`, `send.shop`, `shop` for MX).
4. Wait for Resend to show **Verified** (often minutes; up to 48h).
5. Update Vercel:
   - `RESEND_FROM_EMAIL` = `Magali <hello@shop.magali.store>`
6. Redeploy.

## 4. Test

1. Open **https://magali.store/api/health** — `resend_key`, `contact_inbox` should be `"ok": true`.
2. Admin → **Settings** → **Notifications** → **Send test email**.
3. Submit the **Contact** form on the storefront.
4. Complete a **Stripe test checkout** and confirm:
   - Customer receives order confirmation
   - `CONTACT_TO_EMAIL` receives fulfillment alert

## 5. Troubleshooting

| Symptom | Fix |
|--------|-----|
| Test email fails with domain error | Finish domain verification; update `RESEND_FROM_EMAIL` |
| Contact form succeeds but no mail | Check `RESEND_API_KEY` and `CONTACT_TO_EMAIL` on **Production**; redeploy |
| Order in admin but no email | Webhook worked; Resend key or from-address issue — check Vercel function logs |
| Mail goes to spam | Complete DKIM + DMARC; use verified `@magali.store` sender |

## Related env vars

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Authenticate send requests |
| `CONTACT_TO_EMAIL` | Internal inbox (orders, contact form, fulfillment alerts) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public footer address (e.g. `hello@shop.magali.store`) |
| `RESEND_FROM_EMAIL` | From line on all transactional mail |

See also `docs/DEPLOY.md` and `docs/GO_LIVE_CHECKLIST.md`.
