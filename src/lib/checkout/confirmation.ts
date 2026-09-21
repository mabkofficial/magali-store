import { getAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export type OrderConfirmationData = {
  sessionId: string;
  orderId: string | null;
  orderReference: string;
  customerEmail: string | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  lineItems: { name: string; quantity: number; unitAmountCents: number }[];
  isLoggedInCheckout: boolean;
};

function isCheckoutSessionId(id: string): boolean {
  return id.startsWith("cs_") && id.length <= 200;
}

export async function getOrderConfirmation(
  sessionId: string,
): Promise<OrderConfirmationData | null> {
  if (!isCheckoutSessionId(sessionId)) return null;

  const stripe = getStripe();
  if (!stripe) return null;

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return null;
  }

  if (session.payment_status !== "paid") return null;

  const admin = getAdminClient();
  let orderId: string | null = null;
  if (admin) {
    const { data: order } = await admin
      .from("orders")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    orderId = order?.id ?? null;
  }

  const referenceSource = orderId ?? sessionId;
  const orderReference = referenceSource.slice(0, 8).toUpperCase();

  const lineItems =
    session.line_items && "data" in session.line_items
      ? session.line_items.data.map((item) => ({
          name: item.description ?? "Item",
          quantity: item.quantity ?? 1,
          unitAmountCents: item.price?.unit_amount ?? 0,
        }))
      : [];

  const subtotalCents = session.amount_subtotal ?? 0;
  const shippingCents = session.total_details?.amount_shipping ?? 0;
  const totalCents = session.amount_total ?? subtotalCents + shippingCents;

  return {
    sessionId,
    orderId,
    orderReference,
    customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
    subtotalCents,
    shippingCents,
    totalCents,
    lineItems,
    isLoggedInCheckout: Boolean(session.metadata?.magali_user_id?.trim()),
  };
}
