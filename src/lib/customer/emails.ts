import {
  emailKeyValueTable,
  emailPanel,
  emailParagraph,
} from "@/lib/email/brand-blocks";
import { wrapBrandEmail } from "@/lib/email/brand-layout";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";

  const html = wrapBrandEmail({
    preheader: "Welcome to Magali",
    eyebrow: "Your account",
    headline: "Welcome to Magali",
    bodyHtml: `${emailParagraph(greeting)}${emailParagraph(
      "Your account is ready. Track orders, save favorites to your wishlist, and reorder in a tap.",
    )}`,
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
  const trackingRows =
    input.trackingNumber?.trim()
      ? emailPanel(
          emailKeyValueTable([
            {
              label: "Carrier",
              value: input.carrier?.trim() || "—",
            },
            { label: "Tracking", value: input.trackingNumber.trim() },
          ]),
        )
      : "";

  const html = wrapBrandEmail({
    preheader: `Order ${ref} has shipped`,
    eyebrow: "Shipping update",
    headline: "Your order is on the way",
    bodyHtml: `${emailParagraph(`Your order <strong>${ref}</strong> has shipped.`)}${trackingRows}`,
    cta: {
      label: "View order",
      href: `${siteConfig.url}/account/orders/${input.orderId}`,
    },
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
