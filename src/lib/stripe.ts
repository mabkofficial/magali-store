import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey);
  }

  return stripeInstance;
}

/** Server: secret key. Client cart UI: publishable key (secret is never bundled). */
export function isStripeConfigured(): boolean {
  if (typeof window === "undefined") {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  }
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}
