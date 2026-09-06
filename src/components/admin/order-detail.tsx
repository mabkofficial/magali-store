"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/cms-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LineItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type AdminOrderDetail = {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  line_items: LineItem[];
  shipping_address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: string;
  created_at: string;
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function OrderDetail({ order }: { order: AdminOrderDetail }) {
  const address = order.shipping_address;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to orders
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {order.customer_email}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(order.customer_email);
                toast.success("Email copied");
              }}
            >
              <Copy className="size-4" />
              Copy email
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              render={
                <a
                  href={`https://dashboard.stripe.com/search?query=${order.stripe_session_id}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <ExternalLink className="size-4" />
              Open in Stripe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.line_items.map((item) => (
                <div
                  key={`${order.id}-${item.productId}`}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {[address.city, address.state, address.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {address.country && <p>{address.country}</p>}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCents(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCents(order.shipping_cents)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-medium">
                <span>Total</span>
                <span>{formatCents(order.total_cents)}</span>
              </div>
              <p className="text-xs text-muted-foreground break-all">
                Stripe session: {order.stripe_session_id}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === "paid" && (
                <form action={updateOrderStatus.bind(null, order.id, "fulfilled")}>
                  <Button type="submit" className="w-full">
                    Mark fulfilled
                  </Button>
                </form>
              )}
              {order.status !== "refunded" && (
                <form action={updateOrderStatus.bind(null, order.id, "refunded")}>
                  <Button type="submit" variant="outline" className="w-full">
                    Mark refunded
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
