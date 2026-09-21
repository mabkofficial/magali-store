# Magali Store — pre-launch testing (Stripe test mode)

Use this after production env is configured. Quick config check: **https://magali.store/api/health** should show `"ok": true`.

## 1. Email (Resend)

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Admin → **Settings → Notifications** → **Send test email** | Toast success; mail at `CONTACT_TO_EMAIL` from `hello@shop.magali.store` |
| 1.2 | Local: `npm run test:email` (with `.env.local` from `vercel env pull`) | CLI confirms send |
| 1.3 | Footer on homepage | Shows **hello@shop.magali.store** (or `NEXT_PUBLIC_CONTACT_EMAIL`) |
| 1.4 | **Contact** page — submit a real message | Mail at `CONTACT_TO_EMAIL`; reply-to is customer email |

## 2. Checkout (Stripe test)

Stripe Dashboard must be in **Test mode**. Test card: **4242 4242 4242 4242**, any future expiry/CVC, US address.

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Add hair care or wellness product → **Checkout** | Redirect to Stripe Checkout |
| 2.2 | Complete payment | Return to `/cart?checkout=success`; cart clears; success toast |
| 2.3 | Stripe → **Payments** | Test payment visible |
| 2.4 | Stripe → **Webhooks** → your endpoint | `checkout.session.completed` → **200** |
| 2.5 | **Admin → Orders** | New order with line items and address |
| 2.6 | Email | Customer confirmation + fulfillment at `CONTACT_TO_EMAIL` |
| 2.7 | **Admin → Products** | Inventory decreased for purchased SKU |

## 3. Frozen products (optional)

Only if `FROZEN_CHECKOUT_ENABLED=true` on **Production** in Vercel:

- Add beef pie → checkout → same checks as §2 with frozen shipping rate ($24.99 default).

If false, checkout should block with a contact message.

## 4. Regression smoke

- [ ] `/shop` and one PDP load; add to cart works
- [ ] `/admin/login` with allowlisted email
- [ ] Newsletter signup (homepage) — row in **Admin → Subscribers**
- [ ] Mobile cart drawer (375px width)

## 5. After testing passes

1. Rotate any API keys shared in chat (Stripe, Resend).
2. Follow **Switch to live** in `docs/GO_LIVE_CHECKLIST.md` when the client approves real charges.

## Env reference (production)

| Variable | Role |
|----------|------|
| `STRIPE_SECRET_KEY` / webhook secret | Checkout + orders |
| `RESEND_API_KEY` | Sending mail |
| `RESEND_FROM_EMAIL` | `Magali <hello@shop.magali.store>` |
| `CONTACT_TO_EMAIL` | Internal inbox (orders + contact form) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public footer display |

See `docs/RESEND_PRODUCTION.md` and `docs/DEPLOY.md`.
