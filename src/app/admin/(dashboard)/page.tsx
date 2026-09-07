import Link from "next/link";
import { DashboardStats, statIcons } from "@/components/admin/dashboard-stats";
import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/cms-button";

export default async function AdminOverviewPage() {
  const admin = getAdminClient();

  const [products, orders, subscribers, recentOrders] = admin
    ? await Promise.all([
        admin.from("products").select("*", { count: "exact", head: true }),
        admin.from("orders").select("*", { count: "exact", head: true }),
        admin
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true }),
        admin
          .from("orders")
          .select("id, customer_email, total_cents, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ])
    : [
        { count: 0 },
        { count: 0 },
        { count: 0 },
        { data: [] as never[] },
      ];

  const stats = [
    {
      label: "Products",
      value: products.count ?? 0,
      href: "/admin/products",
      description: "Active catalog items",
      footer: "Manage pricing and inventory",
      icon: statIcons.products,
    },
    {
      label: "Orders",
      value: orders.count ?? 0,
      href: "/admin/orders",
      description: "Total orders received",
      footer: "View fulfillment queue",
      icon: statIcons.orders,
    },
    {
      label: "Subscribers",
      value: subscribers.count ?? 0,
      href: "/admin/subscribers",
      description: "Newsletter signups",
      footer: "Captured from homepage",
      icon: statIcons.subscribers,
    },
  ];

  return (
    <div className="stack-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
          <p className="text-sm text-muted-foreground">
            Magali storefront operations at a glance.
          </p>
        </div>
        <Link href="/admin/products">
          <Button>Manage products</Button>
        </Link>
      </div>

      <DashboardStats stats={stats} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Recent orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <OrdersTable orders={recentOrders.data ?? []} />
      </div>
    </div>
  );
}
