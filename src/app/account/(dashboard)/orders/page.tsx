import Link from "next/link";
import { format } from "date-fns";
import { CustomerOrderStatusBadge } from "@/components/account/order-status-badge";
import { getCustomerContext } from "@/lib/customer/auth";
import { createClient } from "@/lib/supabase/server";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function AccountOrdersPage() {
  const customer = await getCustomerContext();
  if (!customer) return null;

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_cents, created_at")
    .eq("user_id", customer.userId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Orders</h2>
      {!orders?.length ? (
        <p className="mt-6 text-sm text-muted">
          When you place an order while signed in—or link a guest order with the
          same email—it will appear here.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border border border-border">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium text-ink">
                    {format(new Date(order.created_at), "MMMM d, yyyy")}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    #{order.id.slice(0, 8).toUpperCase()} · {formatCents(order.total_cents)}
                  </p>
                </div>
                <CustomerOrderStatusBadge status={order.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
