/**
 * Re-process a paid Stripe Checkout session (orders + emails).
 * Usage: SESSION_ID=cs_test_... npm run replay:checkout
 */
import { loadEnvLocal } from "./load-env-local.mjs";
import Stripe from "stripe";
import { processPaidCheckoutSession } from "../src/lib/process-checkout-session";
import { getStripe } from "../src/lib/stripe";

loadEnvLocal();

async function main() {
  const sessionId = process.env.SESSION_ID;
  if (!sessionId) {
    console.error("Set SESSION_ID to a Stripe checkout session id (cs_...).");
    process.exit(1);
  }

  const stripe = getStripe();
  if (!stripe) {
    console.error("STRIPE_SECRET_KEY not configured.");
    process.exit(1);
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const result = await processPaidCheckoutSession(stripe, session);

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

main();
