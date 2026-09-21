# Magali launch readiness

Use with `docs/GO_LIVE_CHECKLIST.md`, `docs/TESTING.md`, and `docs/RESEND_PRODUCTION.md`.

## Infrastructure (configured)

| Item | Status |
|------|--------|
| Canonical URL | `https://www.magali.store` (Stripe webhooks + checkout redirects) |
| Stripe test checkout + webhook | `https://www.magali.store/api/webhooks/stripe` |
| Resend | `hello@shop.magali.store` sender, verified domain |
| Supabase products/orders/admin | Production project linked in Vercel |
| Health check | `/api/health` |

## SEO & discovery

| Asset | URL |
|-------|-----|
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` (blocks `/admin`, `/api`, `/cart`) |
| LLM / agent summary | `/llms.txt` |
| Web app manifest | `/manifest.webmanifest` |
| Organization + WebSite JSON-LD | All pages (root layout) |
| Product + Breadcrumb JSON-LD | Product/bundle PDPs |
| FAQPage JSON-LD | `/faq` |

## Email flows

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Paid checkout (webhook) | Customer | Branded HTML order confirmation |
| Paid checkout (webhook) | `CONTACT_TO_EMAIL` | Branded fulfillment alert |
| Contact form | `CONTACT_TO_EMAIL` | Plain + reply-to customer |
| Contact form | Customer | Auto-receipt (if Resend configured) |
| Admin test | Admin + inbox | Settings → Notifications |

Missed webhook order: `SESSION_ID=cs_... npm run replay:checkout`

## Before announcing launch

1. Complete `docs/TESTING.md` (checkout + emails).
2. Rotate any API keys ever pasted in chat.
3. Switch Stripe to **live** keys + **live** webhook secret on `www` URL.
4. Set footer phone/social env vars if desired.
5. Client sign-offs in `docs/LAUNCH_UNKNOWN.md`.

## Optional post-launch

- Google Search Console: submit sitemap
- GA4: `NEXT_PUBLIC_GA_ID`
- Rich Results Test on sample PDP URLs
