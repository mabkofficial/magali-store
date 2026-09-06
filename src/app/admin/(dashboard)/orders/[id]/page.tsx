import { notFound } from "next/navigation";
import {
  OrderDetail,
  type AdminOrderDetail,
} from "@/components/admin/order-detail";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) notFound();

  const { data: order } = await admin.from("orders").select("*").eq("id", id).single();

  if (!order) notFound();

  const detail: AdminOrderDetail = {
    id: order.id,
    stripe_session_id: order.stripe_session_id,
    customer_email: order.customer_email,
    line_items: order.line_items as AdminOrderDetail["line_items"],
    shipping_address: order.shipping_address as AdminOrderDetail["shipping_address"],
    subtotal_cents: order.subtotal_cents,
    shipping_cents: order.shipping_cents,
    total_cents: order.total_cents,
    status: order.status,
    created_at: order.created_at,
  };

  return <OrderDetail order={detail} />;
}
