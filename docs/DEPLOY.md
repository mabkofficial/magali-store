# Deploying Magali Store

## 1. Vercel (Hobby tier)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Next.js**
3. Add environment variables from `.env.local.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://shop.magali.com`)
5. Deploy

## 2. Supabase (Free tier)

Project: `oqelvlqbpngqfioipcbg` (`https://oqelvlqbpngqfioipcbg.supabase.co`)

1. Migrations `001_initial` and `002_seed_products` are applied (products, orders, newsletter_subscribers)
2. Copy **Project URL**, **anon key**, and **service role key** into Vercel env vars
3. Create an admin user: **Authentication → Users → Add user** (email + password)
4. Re-seed products after schema changes: `npm run seed:products` (requires `SUPABASE_SERVICE_ROLE_KEY`)

## 3. Stripe

1. Create a Stripe account and use **test mode** first
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel
3. Create a webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Event: `checkout.session.completed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`
5. For local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 4. Resend (Free tier)

1. Create account at [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` and set `CONTACT_TO_EMAIL` to your fulfillment inbox
3. Verify your sending domain and update `RESEND_FROM_EMAIL` for production

## 5. Custom domain

1. Add domain in Vercel project settings
2. Update DNS at your registrar (GoDaddy, etc.)
3. Confirm SSL is active
4. Update `NEXT_PUBLIC_SITE_URL` to the live domain and redeploy

## 6. Optional

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- `FROZEN_CHECKOUT_ENABLED=true` — enable beef pie checkout once shipping is confirmed
- `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL` — footer contact info

## Admin access

- URL: `/admin/login`
- Sign in with the Supabase Auth user created in step 2
- Manage products at `/admin/products`, view orders at `/admin/orders`
