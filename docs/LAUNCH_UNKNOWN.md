# Magali Launch Unknowns

Items intentionally deferred until client confirmation. Update this file as values are confirmed.

## Product Data

- [ ] **Hair Grease size:** Client said 8 oz; label says 185 g / 6.5 oz — currently using label value
- [ ] **PureHeal size:** Client says 2 oz; label shows 60 ml / 2.03 fl oz — currently using label value
- [ ] **Hair Oil naming:** Hair Oil / Hair Growth Oil / Botanical Hair Oil — confirm official name
- [ ] **Beef Pies naming:** pies vs patties/pasties — currently using "pies" in UI

## Compliance & Claims

- [ ] **PureHeal public claims:** Review final wording before full commercial launch (cold sores, oral, muscle/joint references in client materials)
- [ ] **Beef Pies allergen statement:** Artwork shows `CONTAINS: —` — needs confirmation
- [ ] **Label vs AI image QA:** Compare generated product images against `references/labels/` before commercial launch

## Operations

- [x] **Shipping regions and rates:** Defaults configured via env (`STANDARD_SHIPPING_RATE_CENTS=799`, `FROZEN_SHIPPING_RATE_CENTS=2499`, US-only). Confirm with client before live launch.
- [x] **Tax rules:** Sales tax calculated at checkout when Stripe Tax is enabled; otherwise prices are tax-exclusive and documented on Shipping & Returns page.
- [x] **Return/refund policies:** Draft policy live on `/shipping-returns` — pending legal review.
- [ ] **Business contact info and social links:** Set via `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`
- [x] **Inventory counts:** Managed in Supabase; editable at `/admin/products`
- [ ] **Stripe live payment keys:** Use test mode until go-live checklist complete
- [x] **Newsletter provider:** Subscribers stored in Supabase `newsletter_subscribers` table

## Frozen Food

- [x] **Frozen shipping method and cost:** Default $24.99 flat rate via `FROZEN_SHIPPING_RATE_CENTS` — confirm with client
- [ ] **Enable checkout:** Set `FROZEN_CHECKOUT_ENABLED=true` in Vercel env once client approves frozen shipping

## Infrastructure (implemented)

- [x] Product images in `public/images/products/`
- [x] Supabase schema: products, orders, newsletter_subscribers
- [x] Admin panel at `/admin` (Supabase Auth)
- [x] Stripe Checkout with shipping address and flat-rate shipping
- [x] Stripe webhook → Supabase orders + Resend emails
- [x] Deploy guide: `docs/DEPLOY.md`
- [x] Go-live checklist: `docs/GO_LIVE_CHECKLIST.md`

## Not Required for Trademark Filing

The following can remain pending during trademark registration launch:

- Final allergen statements
- Frozen shipping rates (defaults in place; client sign-off pending)
- PureHeal compliance finalization
- Label vs AI image QA
- Live Stripe keys (test mode acceptable)
