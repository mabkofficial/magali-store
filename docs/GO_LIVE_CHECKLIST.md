# Go-Live Checklist

Use this checklist before switching Stripe to live mode and announcing the store.

## Storefront

- [ ] All 4 product images load on shop and PDP pages
- [ ] Mobile layout verified at 375px, 768px, and 1024px
- [ ] Logo and favicon display correctly
- [ ] Sitemap and robots.txt accessible
- [ ] JSON-LD product schema validates in Google Rich Results Test

## Catalog and inventory

- [ ] Products seeded in Supabase (`npm run seed:products`)
- [ ] Prices match approved retail values
- [ ] Inventory counts set in `/admin/products`
- [ ] Out-of-stock products show "Out of Stock" and block add-to-cart
- [ ] Inactive products hidden from storefront

## Checkout (test mode)

- [ ] Add item to cart → checkout → pay with Stripe test card `4242 4242 4242 4242`
- [ ] Shipping address collected (US only)
- [ ] Shipping rate applied (standard $7.99 / frozen $24.99 by default)
- [ ] Success page clears cart and shows confirmation toast
- [ ] Order appears in `/admin/orders`
- [ ] Order appears in Stripe Dashboard
- [ ] Customer confirmation email received (requires Resend)
- [ ] Internal fulfillment email received at `CONTACT_TO_EMAIL`
- [ ] Inventory decremented after webhook fires

## Frozen products

- [ ] Client confirmed frozen shipping rate and regions
- [ ] Set `FROZEN_CHECKOUT_ENABLED=true` in Vercel env
- [ ] Test beef pie checkout end-to-end in test mode

## Operations

- [ ] Shipping & Returns page reflects final rates and regions
- [ ] Contact form delivers to `CONTACT_TO_EMAIL`
- [ ] Footer shows contact email, phone, and social links (if configured)
- [ ] FAQ content reviewed for accuracy

## Marketing

- [ ] Newsletter signup persists to Supabase `newsletter_subscribers`
- [ ] GA4 receiving pageviews (if `NEXT_PUBLIC_GA_ID` set)

## Client sign-offs

Review remaining items in `docs/LAUNCH_UNKNOWN.md` and confirm with client before live launch.

## Switch to live

- [ ] Replace Stripe test keys with live keys in Vercel
- [ ] Create live webhook endpoint in Stripe Dashboard
- [ ] Update `STRIPE_WEBHOOK_SECRET` with live signing secret
- [ ] Place one real small order and verify full flow manually
- [ ] Monitor first 5 orders via admin + Stripe Dashboard
