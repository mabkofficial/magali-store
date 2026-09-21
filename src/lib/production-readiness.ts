export type EnvCheck = {
  id: string;
  label: string;
  ok: boolean;
  hint?: string;
};

function has(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

/** Server-only snapshot of required production configuration (no secret values). */
export function getProductionEnvChecks(): EnvCheck[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "";
  const usingResendSandboxFrom =
    !fromEmail || fromEmail.includes("onboarding@resend.dev");

  return [
    {
      id: "site_url",
      label: "Public site URL",
      ok: has(siteUrl) && siteUrl.startsWith("https://"),
      hint: "Set NEXT_PUBLIC_SITE_URL to your live https domain (e.g. https://magali.store).",
    },
    {
      id: "supabase",
      label: "Supabase",
      ok:
        has(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        has(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
        has(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hint: "Add Supabase URL, anon key, and service role key in Vercel.",
    },
    {
      id: "stripe",
      label: "Stripe checkout",
      ok: has(process.env.STRIPE_SECRET_KEY),
      hint: "Add STRIPE_SECRET_KEY (test or live) in Vercel.",
    },
    {
      id: "stripe_webhook",
      label: "Stripe webhook",
      ok: has(process.env.STRIPE_WEBHOOK_SECRET),
      hint: "Create checkout.session.completed webhook and set STRIPE_WEBHOOK_SECRET.",
    },
    {
      id: "resend_key",
      label: "Resend API key",
      ok: has(process.env.RESEND_API_KEY),
      hint: "Create an API key at resend.com and set RESEND_API_KEY in Vercel.",
    },
    {
      id: "contact_inbox",
      label: "Order & contact inbox",
      ok: has(process.env.CONTACT_TO_EMAIL),
      hint: "Set CONTACT_TO_EMAIL to the inbox that receives orders and contact form mail.",
    },
    {
      id: "resend_from",
      label: "Verified sender domain",
      ok: has(fromEmail) && !usingResendSandboxFrom,
      hint:
        "Verify magali.store in Resend, then set RESEND_FROM_EMAIL (e.g. Magali <hello@magali.store>). Until then, onboarding@resend.dev only works for limited testing.",
    },
    {
      id: "admin",
      label: "Admin allowlist",
      ok: has(process.env.ADMIN_EMAILS),
      hint: "Set ADMIN_EMAILS to comma-separated emails allowed into /admin.",
    },
  ];
}

export function isProductionReady(): boolean {
  const checks = getProductionEnvChecks();
  const required = checks.filter((c) => c.id !== "resend_from");
  return required.every((c) => c.ok);
}
