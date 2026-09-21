import { sendEmail } from "@/lib/email";

export interface OrderEmailLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
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

function buildOrderHtml(data: OrderEmailData): string {
  const rows = data.lineItems
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatUSD(item.unitPrice)}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;color:#1c211f;line-height:1.5;max-width:560px;margin:0 auto;padding:24px">
  <p style="letter-spacing:0.12em;text-transform:uppercase;font-size:12px;color:#214537">Magali</p>
  <h1 style="font-size:22px;font-weight:normal;margin:16px 0">Thank you for your order</h1>
  <p style="color:#5c6560;font-size:14px">Order <strong>${data.orderId.slice(0, 8)}</strong></p>
  <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px">
    <thead><tr><th style="text-align:left;font-weight:normal;color:#5c6560">Item</th><th style="font-weight:normal;color:#5c6560">Qty</th><th style="text-align:right;font-weight:normal;color:#5c6560">Price</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="font-size:14px">Subtotal: ${formatCents(data.subtotalCents)}<br/>
  Shipping: ${formatCents(data.shippingCents)}<br/>
  <strong>Total: ${formatCents(data.totalCents)}</strong></p>
  <p style="font-size:14px;color:#5c6560;margin-top:24px"><strong>Ship to</strong><br/>${formatAddress(data.shippingAddress).replace(/\n/g, "<br/>")}</p>
  <p style="font-size:13px;color:#5c6560;margin-top:32px">Questions? Reply to this email or contact us at hello@shop.magali.store.</p>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData,
): Promise<boolean> {
  const text = buildOrderText(data);
  const html = buildOrderHtml(data);

  return sendEmail({
    to: data.customerEmail,
    subject: "Your Magali order confirmation",
    text,
    html,
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
    subject: `[Magali] New order ${data.orderId.slice(0, 8)}`,
    text,
    html: `<pre style="font-family:monospace;font-size:13px">${text.replace(/</g, "&lt;")}</pre>`,
  });
}
