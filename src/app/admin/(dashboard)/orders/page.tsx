import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminOrdersPage() {
  const admin = getAdminClient();
  const { data: orders } = admin
    ? await admin
        .from("orders")
        .select("id, customer_email, total_cents, status, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground">
          Orders captured from Stripe checkout webhooks.
        </p>
      </div>
      <OrdersTable orders={orders ?? []} />
    </div>
  );
}
