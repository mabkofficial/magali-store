# Magali E-Commerce Website

A Next.js storefront for Magali botanical hair care, wellness products, and Caribbean food favorites.

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL (required for Stripe, SEO, sitemap) |
| `STRIPE_SECRET_KEY` | Stripe secret key for checkout |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Optional webhook secret |
| `CONTACT_TO_EMAIL` | Inbox for contact form + order fulfillment alerts |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public email shown in footer (e.g. hello@shop.magali.store) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | Verified sender (e.g. Magali \<hello@shop.magali.store\>) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (orders + inventory) |
| `NEXT_PUBLIC_GA_ID` | Optional Google Analytics ID |
| `FROZEN_CHECKOUT_ENABLED` | Set to `true` to enable online checkout for frozen beef pies (requires shipping setup) |

## Product Data

Products are defined in `src/data/products.json`. To update:

1. Edit the JSON file
2. Replace images in `public/images/products/`
3. Redeploy

## Stripe Checkout

- Checkout re-reads prices server-side from product data (never trusts client prices)
- Frozen beef pies are gated until `FROZEN_CHECKOUT_ENABLED=true` is set in environment variables (see `src/config/site.ts`)
- Without Stripe keys, cart works but checkout shows a contact fallback

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Connect GoDaddy domain via DNS records provided by Vercel

## Documentation

- `docs/TESTING.md` — Stripe test + email verification checklist
- `docs/DEPLOY.md` — Vercel, Supabase, Stripe, Resend
- `docs/RESEND_PRODUCTION.md` — Resend domain (shop.magali.store)
- `docs/GO_LIVE_CHECKLIST.md` — switch to Stripe live mode
- `docs/LAUNCH_UNKNOWN.md` — items pending client confirmation

## Trademark Launch Checklist

- [ ] Live URL with SSL
- [ ] Magali brand visible in header/footer
- [ ] All 4 products with names, prices, images
- [ ] Add to Cart / Checkout path for standard items
- [ ] About and Contact pages live
