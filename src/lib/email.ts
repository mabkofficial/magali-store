interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Magali <onboarding@resend.dev>";

  if (!resendKey) {
    console.log("Email not configured:", options.subject);
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }),
  });

  if (!response.ok) {
    console.error("Resend error:", await response.text());
    return false;
  }

  return true;
}

interface OrderEmailLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderEmailData {
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

function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData,
): Promise<void> {
  const text = buildOrderText(data);

  await sendEmail({
    to: data.customerEmail,
    subject: `Your Magali order confirmation`,
    text,
  });
}

export async function sendFulfillmentEmail(data: OrderEmailData): Promise<void> {
  const contactEmail = process.env.CONTACT_TO_EMAIL;
  if (!contactEmail) return;

  const text = `New order to fulfill\n\n${buildOrderText(data)}\n\nCustomer: ${data.customerEmail}`;

  await sendEmail({
    to: contactEmail,
    subject: `[Magali] New order ${data.orderId.slice(0, 8)}`,
    text,
  });
}
