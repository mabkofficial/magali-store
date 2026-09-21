import { wrapBrandEmail } from "@/lib/email/brand-layout";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";
  const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px">${greeting}</p>
<p style="margin:0 0 16px;font-size:15px">Your Magali account is ready. Track orders, save favorites to your wishlist, and reorder in a tap.</p>`;

  const html = wrapBrandEmail({
    preheader: "Welcome to Magali",
    headline: "Welcome to Magali",
    bodyHtml,
    cta: { label: "Go to my account", href: `${siteConfig.url}/account` },
  });

  return sendEmail({
    to: email,
    subject: "Welcome to Magali",
    text: `${greeting}\n\nYour Magali account is ready. Visit ${siteConfig.url}/account to track orders and manage your wishlist.`,
    html,
  });
}

export async function sendOrderShippedEmail(input: {
  customerEmail: string;
  orderId: string;
  carrier?: string | null;
  trackingNumber?: string | null;
}) {
  const ref = input.orderId.slice(0, 8).toUpperCase();
  const trackingLine =
    input.trackingNumber?.trim()
      ? `<p style="margin:16px 0 0;font-size:14px"><strong>Tracking:</strong> ${input.carrier?.trim() ? `${input.carrier} — ` : ""}${input.trackingNumber}</p>`
      : "";

  const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px">Your order <strong>${ref}</strong> is on its way.</p>
${trackingLine}`;

  const html = wrapBrandEmail({
    preheader: `Order ${ref} has shipped`,
    headline: "Your order is on the way",
    bodyHtml,
    cta: { label: "View order", href: `${siteConfig.url}/account/orders/${input.orderId}` },
  });

  const textTracking = input.trackingNumber
    ? `\nTracking: ${input.carrier ? `${input.carrier} ` : ""}${input.trackingNumber}`
    : "";

  return sendEmail({
    to: input.customerEmail,
    subject: `Your Magali order has shipped (${ref})`,
    text: `Your order ${ref} has shipped.${textTracking}\n\nView details: ${siteConfig.url}/account/orders/${input.orderId}`,
    html,
  });
}
