import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ReorderButton } from "@/components/account/reorder-button";
import { CustomerOrderStatusBadge } from "@/components/account/order-status-badge";
import type { StoredOrderLineItem } from "@/app/account/(dashboard)/actions";
import { getCustomerContext } from "@/lib/customer/auth";
import { createClient } from "@/lib/supabase/server";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerContext();
  if (!customer) return null;

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", customer.userId)
    .maybeSingle();

  if (!order) notFound();

  const lineItems = order.line_items as StoredOrderLineItem[];
  const address = order.shipping_address as {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">Order</p>
          <h2 className="mt-2 font-display text-2xl text-ink">
            #{order.id.slice(0, 8).toUpperCase()}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CustomerOrderStatusBadge status={order.status} />
          <ReorderButton orderId={order.id} />
        </div>
      </div>

      {(order.tracking_number || order.status === "shipped") && (
        <div className="border border-border bg-surface-muted p-4 text-sm">
          <p className="eyebrow text-muted">Tracking</p>
          {order.tracking_number ? (
            <p className="mt-2 text-ink">
              {order.tracking_carrier ? `${order.tracking_carrier}: ` : ""}
              {order.tracking_number}
            </p>
          ) : (
            <p className="mt-2 text-muted">Shipped — tracking details coming soon.</p>
          )}
        </div>
      )}

      <section>
        <h3 className="eyebrow text-muted">Items</h3>
        <ul className="mt-4 divide-y divide-border border border-border">
          {lineItems.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex justify-between gap-4 px-4 py-3 text-sm"
            >
              <div>
                <p className="text-ink">{item.name}</p>
                <p className="text-muted">Qty {item.quantity}</p>
              </div>
              <p className="tabular-nums text-ink">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h3 className="eyebrow text-muted">Totals</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatCents(order.subtotal_cents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{formatCents(order.shipping_cents)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-medium">
              <dt>Total</dt>
              <dd>{formatCents(order.total_cents)}</dd>
            </div>
          </dl>
        </section>
        {address && (
          <section>
            <h3 className="eyebrow text-muted">Ship to</h3>
            <address className="mt-4 text-sm not-italic text-muted">
              {address.line1}
              {address.line2 && (
                <>
                  <br />
                  {address.line2}
                </>
              )}
              <br />
              {[address.city, address.state, address.postal_code]
                .filter(Boolean)
                .join(", ")}
              {address.country && (
                <>
                  <br />
                  {address.country}
                </>
              )}
            </address>
          </section>
        )}
      </div>
    </div>
  );
}
