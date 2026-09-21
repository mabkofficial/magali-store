import {
  emailKeyValueTable,
  emailLabel,
  emailOrderLinesTable,
  emailPanel,
  emailParagraph,
  emailTotalsTable,
} from "@/lib/email/brand-blocks";
import { wrapBrandEmail } from "@/lib/email/brand-layout";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";
import { emailColors, emailFonts } from "@/lib/email/brand-tokens";

export interface OrderEmailLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  productId?: string;
  bundleId?: string;
}

export interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  lineItems: OrderEmailLineItem[];
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  };
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatAddress(
  address: OrderEmailData["shippingAddress"],
): string {
  if (!address) return "Not provided";

  const lines = [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);

  return lines.join("\n");
}

function buildOrderText(data: OrderEmailData): string {
  const items = data.lineItems
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (${formatUSD(item.unitPrice)} each)`,
    )
    .join("\n");

  return `Order confirmation

Order ID: ${data.orderId}

Items:
${items}

Subtotal: ${formatCents(data.subtotalCents)}
Shipping: ${formatCents(data.shippingCents)}
Total: ${formatCents(data.totalCents)}

Shipping address:
${formatAddress(data.shippingAddress)}

Thank you for shopping with Magali.`;
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const ref = data.orderId.slice(0, 8).toUpperCase();
  const addressHtml = formatAddress(data.shippingAddress).replace(
    /\n/g,
    "<br/>",
  );

  const bodyHtml = `
${emailParagraph(`Order reference <strong style="color:${emailColors.ink}">${ref}</strong>`, true)}
${emailParagraph("We received your order and will email you when it ships.")}
${emailOrderLinesTable(
  data.lineItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitPriceLabel: formatUSD(item.unitPrice),
  })),
)}
${emailTotalsTable([
  { label: "Subtotal", value: formatCents(data.subtotalCents) },
  { label: "Shipping", value: formatCents(data.shippingCents) },
  { label: "Total", value: formatCents(data.totalCents), strong: true },
])}
<p style="margin:28px 0 0">${emailLabel("Ship to")}<span style="color:${emailColors.muted};font-size:14px;font-family:${emailFonts.sans};display:inline-block;margin-top:8px">${addressHtml}</span></p>`;

  return wrapBrandEmail({
    preheader: `Order confirmed — total ${formatCents(data.totalCents)}`,
    headline: "Thank you for your order",
    bodyHtml,
    cta: { label: "Continue shopping", href: siteConfig.url + "/shop" },
  });
}

function buildFulfillmentHtml(data: OrderEmailData): string {
  const itemsList = data.lineItems
    .map(
      (item) =>
        `<li style="margin:0 0 8px;font-family:${emailFonts.sans};font-size:14px;color:${emailColors.ink}">${item.name} × ${item.quantity} — ${formatUSD(item.unitPrice)} each</li>`,
    )
    .join("");

  const bodyHtml = `
${emailParagraph("<strong>New paid order</strong> — prepare for fulfillment.")}
<ul style="margin:0 0 20px;padding-left:20px">${itemsList}</ul>
${emailPanel(
  emailKeyValueTable([
    { label: "Customer", value: data.customerEmail || "—" },
    { label: "Order ID", value: data.orderId },
    { label: "Total", value: formatCents(data.totalCents) },
  ]),
)}
<p style="margin:20px 0 0;font-size:13px;color:${emailColors.muted};font-family:${emailFonts.sans}"><strong>Ship to:</strong><br/>${formatAddress(data.shippingAddress).replace(/\n/g, "<br/>")}</p>`;

  return wrapBrandEmail({
    preheader: `Fulfill order ${data.orderId.slice(0, 8)} — ${formatCents(data.totalCents)}`,
    eyebrow: "Magali · Fulfillment",
    headline: "New order to pack",
    bodyHtml,
    footerNote: "Manage orders in the Magali admin dashboard.",
  });
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData,
): Promise<boolean> {
  return sendEmail({
    to: data.customerEmail,
    subject: `Your Magali order confirmation (${data.orderId.slice(0, 8).toUpperCase()})`,
    text: buildOrderText(data),
    html: buildOrderConfirmationHtml(data),
  });
}

export async function sendFulfillmentEmail(
  data: OrderEmailData,
): Promise<boolean> {
  const contactEmail = process.env.CONTACT_TO_EMAIL;
  if (!contactEmail) {
    console.error("CONTACT_TO_EMAIL not set — skipping fulfillment email");
    return false;
  }

  const text = `New order to fulfill\n\n${buildOrderText(data)}\n\nCustomer: ${data.customerEmail || "(no email on session)"}`;

  return sendEmail({
    to: contactEmail,
    subject: `[Magali] Fulfill order ${data.orderId.slice(0, 8).toUpperCase()} — ${formatCents(data.totalCents)}`,
    text,
    html: buildFulfillmentHtml(data),
  });
}
