#!/usr/bin/env node
/**
 * Loads .env.local if present, then prints a production readiness checklist.
 * Usage: node scripts/check-production-env.mjs
 */

import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();

function has(key) {
  return Boolean(process.env[key]?.trim());
}

const checks = [
  ["NEXT_PUBLIC_SITE_URL (https)", () => has("NEXT_PUBLIC_SITE_URL") && process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://")],
  ["Supabase URL + keys", () => has("NEXT_PUBLIC_SUPABASE_URL") && has("NEXT_PUBLIC_SUPABASE_ANON_KEY") && has("SUPABASE_SERVICE_ROLE_KEY")],
  ["STRIPE_SECRET_KEY", () => has("STRIPE_SECRET_KEY")],
  ["STRIPE_WEBHOOK_SECRET", () => has("STRIPE_WEBHOOK_SECRET")],
  ["RESEND_API_KEY", () => has("RESEND_API_KEY")],
  ["CONTACT_TO_EMAIL", () => has("CONTACT_TO_EMAIL")],
  ["RESEND_FROM_EMAIL (custom domain)", () => has("RESEND_FROM_EMAIL") && !process.env.RESEND_FROM_EMAIL.includes("onboarding@resend.dev")],
  ["ADMIN_EMAILS", () => has("ADMIN_EMAILS")],
];

let failed = 0;
for (const [label, ok] of checks) {
  const pass = ok();
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) failed += 1;
}

console.log(failed === 0 ? "\nAll required checks passed." : `\n${failed} check(s) need attention.`);
process.exit(failed === 0 ? 0 : 1);
