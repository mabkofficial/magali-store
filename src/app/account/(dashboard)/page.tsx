import Link from "next/link";
import { format } from "date-fns";
import { CustomerOrderStatusBadge } from "@/components/account/order-status-badge";
import { getCustomerContext } from "@/lib/customer/auth";
import { createClient } from "@/lib/supabase/server";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function AccountOverviewPage() {
  const customer = await getCustomerContext();
  if (!customer) return null;

  const supabase = await createClient();

  const [{ data: orders }, { count: wishlistCount }, { data: addresses }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, status, total_cents, created_at")
        .eq("user_id", customer.userId)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("wishlist_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", customer.userId),
      supabase
        .from("customer_addresses")
        .select("label, city, state, is_default")
        .eq("user_id", customer.userId)
        .order("is_default", { ascending: false })
        .limit(1),
    ]);

  const recent = orders?.[0];
  const defaultAddress = addresses?.[0];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <section className="border border-border p-5 sm:col-span-2">
        <h2 className="eyebrow text-muted">Recent order</h2>
        {recent ? (
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium text-ink">
                {format(new Date(recent.created_at), "MMM d, yyyy")}
              </p>
              <p className="mt-1 text-sm text-muted">
                {formatCents(recent.total_cents)} · #{recent.id.slice(0, 8).toUpperCase()}
              </p>
              <div className="mt-3">
                <CustomerOrderStatusBadge status={recent.status} />
              </div>
            </div>
            <Link
              href={`/account/orders/${recent.id}`}
              className="text-sm text-ink underline underline-offset-4"
            >
              View details
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No orders yet.{" "}
            <Link href="/shop" className="text-ink underline underline-offset-4">
              Start shopping
            </Link>
          </p>
        )}
      </section>

      <section className="border border-border p-5">
        <h2 className="eyebrow text-muted">Wishlist</h2>
        <p className="mt-4 text-2xl font-display text-ink">{wishlistCount ?? 0}</p>
        <Link
          href="/account/wishlist"
          className="mt-4 inline-block text-sm text-ink underline underline-offset-4"
        >
          View wishlist
        </Link>
      </section>

      <section className="border border-border p-5 sm:col-span-3">
        <h2 className="eyebrow text-muted">Default address</h2>
        {defaultAddress ? (
          <p className="mt-4 text-sm text-muted">
            <span className="text-ink">{defaultAddress.label}</span>
            {" · "}
            {[defaultAddress.city, defaultAddress.state].filter(Boolean).join(", ")}
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted">No saved addresses yet.</p>
        )}
        <Link
          href="/account/addresses"
          className="mt-4 inline-block text-sm text-ink underline underline-offset-4"
        >
          Manage addresses
        </Link>
      </section>
    </div>
  );
}
