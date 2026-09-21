import { wrapBrandEmail } from "@/lib/email/brand-layout";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

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
  const rows = data.lineItems
    .map(
      (item) =>
        `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #e3e0da;font-size:14px">${item.name}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e3e0da;text-align:center;font-size:14px;color:#6b6860">${item.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid #e3e0da;text-align:right;font-size:14px">${formatUSD(item.unitPrice)}</td>
        </tr>`,
    )
    .join("");

  const addressHtml = formatAddress(data.shippingAddress).replace(
    /\n/g,
    "<br/>",
  );

  const bodyHtml = `
<p style="margin:0 0 8px;font-size:14px;color:#6b6860">Order reference <strong style="color:#1a1a18">${data.orderId.slice(0, 8).toUpperCase()}</strong></p>
<p style="margin:0 0 24px;font-size:15px">We received your order and will email you when it ships.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
  <thead>
    <tr>
      <th align="left" style="padding:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6860;font-weight:400;font-family:Helvetica,Arial,sans-serif">Item</th>
      <th style="padding:0 8px 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6860;font-weight:400;font-family:Helvetica,Arial,sans-serif">Qty</th>
      <th align="right" style="padding:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6860;font-weight:400;font-family:Helvetica,Arial,sans-serif">Price</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;font-size:14px">
  <tr><td style="padding:4px 0;color:#6b6860">Subtotal</td><td align="right">${formatCents(data.subtotalCents)}</td></tr>
  <tr><td style="padding:4px 0;color:#6b6860">Shipping</td><td align="right">${formatCents(data.shippingCents)}</td></tr>
  <tr><td style="padding:12px 0 0;font-size:16px"><strong>Total</strong></td><td align="right" style="padding:12px 0 0;font-size:16px"><strong>${formatCents(data.totalCents)}</strong></td></tr>
</table>
<p style="margin:28px 0 0;font-size:14px"><strong style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#3d5a45;font-family:Helvetica,Arial,sans-serif">Ship to</strong><br/><span style="color:#6b6860;margin-top:8px;display:inline-block">${addressHtml}</span></p>`;

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
        `<li style="margin:0 0 8px">${item.name} × ${item.quantity} — ${formatUSD(item.unitPrice)} each</li>`,
    )
    .join("");

  const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px"><strong>New paid order</strong> — prepare for fulfillment.</p>
<ul style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#1a1a18">${itemsList}</ul>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;background:#f3f2ef;padding:16px;border:1px solid #e3e0da">
  <tr><td style="color:#6b6860;padding:4px 0">Customer</td><td align="right">${data.customerEmail || "—"}</td></tr>
  <tr><td style="color:#6b6860;padding:4px 0">Order ID</td><td align="right">${data.orderId}</td></tr>
  <tr><td style="color:#6b6860;padding:4px 0">Total</td><td align="right"><strong>${formatCents(data.totalCents)}</strong></td></tr>
</table>
<p style="margin:20px 0 0;font-size:13px;color:#6b6860"><strong>Ship to:</strong><br/>${formatAddress(data.shippingAddress).replace(/\n/g, "<br/>")}</p>`;

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
